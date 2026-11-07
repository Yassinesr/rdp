/* ==========================================================================
   STORE SETTINGS: edit these before launch (see README.md)
   ========================================================================== */
const CONFIG = {
  // Your Shopify store address, no trailing slash, e.g. "https://pawse.myshopify.com"
  // or your custom domain. Used for checkout and the policy links in the footer.
  store: "",

  // Support email shown as the footer "Contact" link.
  contactEmail: "",

  // TikTok Pixel ID from TikTok Ads Manager > Assets > Events. Leave empty to disable.
  tiktokPixelId: "",

  currency: "USD",

  // Default delivery promise in business days, from order to doorstep (keep it honest).
  // A page can override it with data-delivery-min / data-delivery-max on <body>.
  deliveryDays: { min: 7, max: 12 },
};
/* ======================================================================== */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: CONFIG.currency }).format(n);

  /* ------------------------------------------------------------ TikTok pixel */
  // Standard TikTok base code, only loaded when a pixel ID is configured.
  function loadTikTokPixel(id) {
    /* eslint-disable */
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e };
      ttq.load = function (e, n) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner;
        ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
        n = d.createElement("script"); n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t;
        e = d.getElementsByTagName("script")[0]; e.parentNode.insertBefore(n, e);
      };
      ttq.load(id);
      ttq.page();
    }(window, document, "ttq");
    /* eslint-enable */
  }

  function track(event, props) {
    if (window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track(event, props);
    }
  }

  /* ------------------------------------------------------------------- toast */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  }

  /* ---------------------------------------------------------- page product */
  // Each page describes its product on <body> and #offer, so one script serves every page.
  const body = document.body;
  const offer = $("#offer");
  const PRODUCT = body.dataset.product || document.title;
  const PRODUCT_ID = body.dataset.productId || "product";
  const UNIT = (offer && offer.dataset.unit) || "item";

  /* --------------------------------------------------------- business days */
  function addBusinessDays(date, days) {
    const d = new Date(date);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return d;
  }
  function subtractBusinessDays(date, days) {
    const d = new Date(date);
    let removed = 0;
    while (removed < days) {
      d.setDate(d.getDate() - 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) removed++;
    }
    return d;
  }
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const today = new Date();
  const delivery = {
    min: Number(body.dataset.deliveryMin) || CONFIG.deliveryDays.min,
    max: Number(body.dataset.deliveryMax) || CONFIG.deliveryDays.max,
  };

  // Shared helpers for page-specific scripts (e.g. assets/portrait.js).
  window.Pawse = { CONFIG, money, track, toast, PRODUCT, PRODUCT_ID, delivery, addBusinessDays };

  /* ------------------------------------------------------- simple bundles */
  // Pages with plain bundle radios (name="bundle") get pricing, savings and a
  // cart-permalink checkout. Pages with their own order form skip this.
  const inputs = $$('input[name="bundle"]');
  let selected = () => null;

  if (inputs.length) {
    const single = inputs.find((i) => Number(i.dataset.qty) === 1);
    const singlePrice = single ? Number(single.dataset.price) : null;

    const bundleInfo = (input) => ({
      qty: Number(input.dataset.qty),
      price: Number(input.dataset.price),
      name: $(".bundle-name", input.closest(".bundle")).textContent.trim(),
      variant: (input.dataset.variant || "").trim(),
      id: input.value,
    });

    // Price labels, per-unit price and savings come from the data attributes.
    // A bundle can set data-note to show its own line instead.
    inputs.forEach((input) => {
      const { qty, price } = bundleInfo(input);
      const label = input.closest(".bundle");
      $("[data-price-label]", label).textContent = money(price);
      const meta = $("[data-meta]", label);
      if (input.dataset.note) {
        meta.textContent = input.dataset.note;
      } else if (qty > 1 && singlePrice) {
        const save = singlePrice * qty - price;
        const parts = [`${money(price / qty)} per ${UNIT}`];
        if (save > 0.004) parts.push(`save ${money(save)}`);
        meta.textContent = parts.join(" · ");
      } else {
        meta.textContent = "";
      }
    });

    const fromPrice = singlePrice ?? Math.min(...inputs.map((i) => Number(i.dataset.price)));
    $$("[data-from-price]").forEach((el) => (el.textContent = money(fromPrice)));

    selected = () => bundleInfo(inputs.find((i) => i.checked) || inputs[0]);

    const render = () => {
      const b = selected();
      $$("[data-total]").forEach((el) => (el.textContent = money(b.price)));
      $$("[data-sticky-price]").forEach((el) => (el.textContent = money(b.price)));
      $$("[data-sticky-name]").forEach((el) => (el.textContent = b.name));
    };
    inputs.forEach((i) => i.addEventListener("change", render));
    render();

    $$("[data-buy]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const b = selected();
        const props = {
          contents: [{ content_id: `${PRODUCT_ID}-${b.id}`, content_name: `${PRODUCT} (${b.name})`, quantity: 1, price: b.price }],
          value: b.price,
          currency: CONFIG.currency,
        };
        track("AddToCart", props);

        if (!CONFIG.store || !b.variant) {
          const note = $("[data-checkout-note]");
          if (note) note.hidden = false;
          toast("Checkout isn't connected yet");
          console.warn("[Pawse] Set CONFIG.store in assets/app.js and data-variant on each bundle.");
          return;
        }

        track("InitiateCheckout", props);
        // Shopify cart permalink: sends the shopper straight to checkout with this variant.
        window.location.href = `${CONFIG.store}/cart/${encodeURIComponent(b.variant)}:1`;
      })
    );
  }

  /* ---------------------------------------------------------- delivery dates */
  const from = addBusinessDays(today, delivery.min);
  const to = addBusinessDays(today, delivery.max);
  $$("[data-delivery]").forEach((el) => (el.textContent = `${fmt.format(from)} – ${fmt.format(to)}`));

  // "Order by ___ for <occasion>": the next occasion whose order-by date (occasion date minus
  // the slowest delivery estimate) hasn't passed. Set data-deadlines on <body> as JSON:
  // [{"name":"Christmas","date":"2026-12-25"}, ...]
  try {
    const deadlines = JSON.parse(body.dataset.deadlines || "[]");
    const next = deadlines
      .map((d) => ({ ...d, orderBy: subtractBusinessDays(new Date(`${d.date}T12:00:00`), delivery.max) }))
      .filter((d) => d.orderBy >= new Date(today.toDateString()))
      .sort((a, b) => a.orderBy - b.orderBy)[0];
    $$("[data-order-by-wrap]").forEach((wrap) => {
      if (!next) {
        wrap.hidden = true;
        return;
      }
      $$("[data-order-by]", wrap).forEach((el) => (el.textContent = fmt.format(next.orderBy)));
      $$("[data-order-by-name]", wrap).forEach((el) => (el.textContent = next.name));
      wrap.hidden = false;
    });
  } catch (err) {
    console.warn("[Pawse] Couldn't read data-deadlines", err);
  }

  /* -------------------------------------------------------- footer + config */
  $$("[data-year]").forEach((el) => (el.textContent = String(today.getFullYear())));
  $$("[data-policy]").forEach((a) => {
    if (CONFIG.store) a.href = `${CONFIG.store}/policies/${a.dataset.policy}`;
  });
  $$("[data-contact]").forEach((a) => {
    if (CONFIG.contactEmail) a.href = `mailto:${CONFIG.contactEmail}`;
  });

  /* -------------------------------------------------------------- sticky bar */
  const sticky = $("[data-sticky]");
  const heroCta = $("#hero-cta");
  if (sticky && heroCta && offer && "IntersectionObserver" in window) {
    let pastHero = false;
    let atOffer = false;
    const update = () => {
      const show = pastHero && !atOffer;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", String(!show));
      $$("a, button", sticky).forEach((el) => (el.tabIndex = show ? 0 : -1));
    };
    new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    }).observe(heroCta);
    new IntersectionObserver(([e]) => {
      atOffer = e.isIntersecting;
      update();
    }, { threshold: 0.15 }).observe(offer);
  }

  /* ------------------------------------------------------------------ pixel */
  if (CONFIG.tiktokPixelId) {
    loadTikTokPixel(CONFIG.tiktokPixelId);
    const b = selected();
    track("ViewContent", {
      contents: [{ content_id: PRODUCT_ID, content_name: PRODUCT }],
      ...(b ? { value: b.price, currency: CONFIG.currency } : {}),
    });
  }
})();
