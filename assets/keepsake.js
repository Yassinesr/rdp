/* Personalized keepsake page: number of pets → (theme) → photos and names → optional add-on
   → Shopify cart, with a live mock-up of the pet's photo, name and theme.
   Relies on window.Pawse from app.js (load app.js first). */
(function () {
  "use strict";

  const P = window.Pawse;
  const form = document.querySelector("[data-keepsake-form]");
  if (!P || !form) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const UNIT = form.dataset.unit || "item"; // "tag" or "keychain"
  const MAX_PHOTO_MB = 15;

  const petInputs = $$('input[name="pets"]', form);
  const bump = $("[data-bump]", form);
  const bumpFields = $("[data-bump-fields]", form);
  const themeInputs = $$('input[name="properties[Theme]"]', form);
  const petRows = $$("[data-pet]", form);
  const variantField = $("[data-variant-field]", form);
  const errorEl = $("[data-form-error]", form);
  const nameInput1 = $('[data-pet="1"] [data-name]', form);

  /* ------------------------------------------------ prices, savings, add-on */
  const single = petInputs.find((i) => i.dataset.qty === "1");
  const singlePrice = single ? Number(single.dataset.price) : null;

  petInputs.forEach((input) => {
    const qty = Number(input.dataset.qty);
    const price = Number(input.dataset.price);
    const label = input.closest(".bundle");
    $("[data-price-label]", label).textContent = P.money(price);
    const meta = $("[data-meta]", label);
    if (qty > 1 && singlePrice) {
      const save = singlePrice * qty - price;
      const parts = [`${P.money(price / qty)} per ${UNIT}`];
      if (save > 0.004) parts.push(`save ${P.money(save)}`);
      meta.textContent = parts.join(" · ");
    }
  });

  if (bump) {
    const addPrice = Number(bump.dataset.price);
    const fullPrice = Number(bump.dataset.fullPrice);
    $$("[data-bump-price]").forEach((el) => (el.textContent = `+${P.money(addPrice)}`));
    $$("[data-bump-save]").forEach((el) =>
      (el.textContent = fullPrice > addPrice ? `save ${P.money(fullPrice - addPrice)}` : "")
    );
  }

  /* -------------------------------------------------------------- state */
  function current() {
    const o = petInputs.find((i) => i.checked) || petInputs[0];
    const withBump = !!(bump && bump.checked);
    return {
      id: o.value + (withBump ? "-plus" : ""),
      qty: Number(o.dataset.qty),
      price: Number(o.dataset.price) + (withBump ? Number(bump.dataset.price) : 0),
      variant: ((withBump ? o.dataset.variantBump : o.dataset.variant) || "").trim(),
      withBump,
    };
  }

  const petName = () => (nameInput1 ? nameInput1.value.trim() : "");
  const possessive = (name) => (name ? `${name}${/s$/i.test(name) ? "'" : "'s"}` : "");

  function render() {
    const c = current();
    const name = petName();

    petRows.forEach((row) => {
      const on = Number(row.dataset.pet) <= c.qty;
      row.hidden = !on;
      $$("input", row).forEach((i) => (i.disabled = !on));
    });

    if (bumpFields) {
      bumpFields.hidden = !c.withBump;
      $$("input, select, textarea", bumpFields).forEach((i) => (i.disabled = !c.withBump));
    }
    if (bump) bump.closest(".bump").classList.toggle("is-on", c.withBump);

    $$("[data-total]").forEach((el) => (el.textContent = P.money(c.price)));
    $$("[data-sticky-price]").forEach((el) => (el.textContent = P.money(c.price)));
    $$("[data-pet-name]").forEach((el) => (el.textContent = name || el.dataset.default || ""));
    $$("[data-pet-possessive]").forEach((el) => (el.textContent = possessive(name) || el.dataset.default || ""));
    $$("[data-mock-name]").forEach((el) => {
      const text = name || el.dataset.default || "";
      el.textContent = text;
      // Shrink long names so they stay on the nameplate.
      const max = Number(el.dataset.maxSize || 24);
      el.setAttribute("font-size", String(Math.min(max, Math.floor(250 / Math.max(text.length, 1)))));
    });
    variantField.value = c.variant;
    hideError();
  }

  function renderTheme() {
    const t = (themeInputs.find((i) => i.checked) || {}).value;
    if (!t) return;
    $$("[data-mock-theme]").forEach((g) => g.toggleAttribute("hidden", g.dataset.mockTheme !== t));
  }

  petInputs.forEach((i) => i.addEventListener("change", render));
  if (bump) bump.addEventListener("change", render);
  // "Add it to my order" links elsewhere on the page tick the add-on.
  $$("[data-check-bump]").forEach((a) =>
    a.addEventListener("click", () => {
      if (!bump) return;
      bump.checked = true;
      render();
    })
  );
  themeInputs.forEach((i) => i.addEventListener("change", renderTheme));
  $$("[data-name]", form).forEach((i) => i.addEventListener("input", render));

  /* ---------------------------------------------------- photos + mock-up */
  function setMockPhoto(url) {
    $$("[data-mock-photo]").forEach((img) => {
      if (url) img.setAttribute("href", url);
      img.toggleAttribute("hidden", !url);
    });
    $$("[data-mock-placeholder]").forEach((g) => g.toggleAttribute("hidden", !!url));
    $$("[data-mock-note]").forEach((el) => (el.hidden = !url));
  }

  $$("[data-photo]", form).forEach((input) => {
    input.addEventListener("change", () => {
      const row = input.closest("[data-pet]");
      const img = $("[data-preview]", row);
      const empty = $(".upload-empty", row);
      const file = input.files && input.files[0];
      const isFirst = row.dataset.pet === "1";
      if (!file) {
        img.hidden = true;
        empty.hidden = false;
        if (isFirst) setMockPhoto("");
        return;
      }
      if (!file.type.startsWith("image/")) {
        input.value = "";
        showError("Please choose an image file (JPG, PNG or HEIC).");
        return;
      }
      if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        input.value = "";
        showError(`That photo is over ${MAX_PHOTO_MB} MB. Please choose a smaller one.`);
        return;
      }
      if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
      const url = URL.createObjectURL(file);
      img.dataset.url = url;
      img.src = url;
      img.hidden = false;
      empty.hidden = true;
      row.classList.remove("is-missing");
      if (isFirst) setMockPhoto(url);
      hideError();
    });
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function hideError() {
    errorEl.hidden = true;
  }

  /* ------------------------------------------------------------- submit */
  // Posts to Shopify's /cart/add as multipart/form-data, so the photo files travel with the order.
  form.addEventListener("submit", (e) => {
    const c = current();
    const missing = [];
    petRows
      .filter((row) => !row.hidden)
      .forEach((row) => {
        const n = row.dataset.pet;
        const photo = $("[data-photo]", row);
        const name = $("[data-name]", row);
        const noPhoto = !(photo.files && photo.files.length);
        const noName = !name.value.trim();
        row.classList.toggle("is-missing", noPhoto || noName);
        if (noPhoto) missing.push(`a photo of pet ${n}`);
        if (noName) missing.push(`pet ${n}'s name`);
      });

    if (missing.length) {
      e.preventDefault();
      showError(`Almost there! Please add ${missing.join(" and ")}.`);
      $(".is-missing", form)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const props = {
      contents: [{ content_id: `${P.PRODUCT_ID}-${c.id}`, content_name: P.PRODUCT, quantity: 1, price: c.price }],
      value: c.price,
      currency: P.CONFIG.currency,
    };
    P.track("AddToCart", props);

    if (!P.CONFIG.store || !c.variant) {
      e.preventDefault();
      $("[data-checkout-note]").hidden = false;
      P.toast("Checkout isn't connected yet");
      console.warn("[Pawse] Set CONFIG.store in assets/app.js and the data-variant / data-variant-bump IDs on each option.");
      return;
    }

    P.track("InitiateCheckout", props);
    const note = $('textarea[name="properties[Gift note]"]', form);
    if (note && !note.value.trim()) note.disabled = true; // don't send an empty note
    form.action = `${P.CONFIG.store}/cart/add`;
  });

  // Back from the cart with the browser's back button: re-enable the note.
  window.addEventListener("pageshow", () => {
    const note = $('textarea[name="properties[Gift note]"]', form);
    if (note) note.disabled = false;
  });

  render();
  renderTheme();
})();
