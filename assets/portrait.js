/* Pet portrait order form: tier → number of pets → theme → photos/names → Shopify cart.
   Relies on window.Pawse from app.js (load app.js first). */
(function () {
  "use strict";

  const P = window.Pawse;
  const form = document.querySelector("[data-order-form]");
  if (!P || !form) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const TIER_NAMES = { tag: "Portrait Tag", relief: "Relief Keychain" };
  const UNITS = { tag: "tag", relief: "keychain" };
  const MAX_PHOTO_MB = 15;

  const tierInputs = $$('input[name="tier"]', form);
  const optionInputs = $$('input[name="option"]', form);
  const themeStep = $("[data-theme-step]", form);
  const themeInputs = $$('input[name="properties[Theme]"]', form);
  const petRows = $$("[data-pet]", form);
  const petsStepNum = $("[data-pets-step-num]", form);
  const variantField = $("[data-variant-field]", form);
  const errorEl = $("[data-form-error]", form);

  const tier = () => (tierInputs.find((i) => i.checked) || tierInputs[0]).value;
  const option = () => optionInputs.find((i) => i.checked && !i.disabled);

  const info = (input) => ({
    id: input.value,
    tier: input.dataset.tier,
    qty: Number(input.dataset.qty),
    price: Number(input.dataset.price),
    variant: (input.dataset.variant || "").trim(),
    name: `${TIER_NAMES[input.dataset.tier]} · ${input.dataset.qty} pet${input.dataset.qty === "1" ? "" : "s"}`,
  });

  /* Price labels and "per item · save" lines, per tier, from data attributes. */
  Object.keys(TIER_NAMES).forEach((t) => {
    const opts = optionInputs.filter((i) => i.dataset.tier === t);
    const single = opts.find((i) => i.dataset.qty === "1");
    const singlePrice = single ? Number(single.dataset.price) : null;
    opts.forEach((input) => {
      const { qty, price } = info(input);
      const label = input.closest(".bundle");
      $("[data-price-label]", label).textContent = P.money(price);
      const meta = $("[data-meta]", label);
      if (qty > 1 && singlePrice) {
        const save = singlePrice * qty - price;
        const parts = [`${P.money(price / qty)} per ${UNITS[t]}`];
        if (save > 0.004) parts.push(`save ${P.money(save)}`);
        meta.textContent = parts.join(" · ");
      }
    });
  });

  function setTier(t) {
    tierInputs.forEach((i) => (i.checked = i.value === t));
    const current = option();
    const keepQty = current ? current.dataset.qty : "1";
    let picked = null;
    optionInputs.forEach((i) => {
      const on = i.dataset.tier === t;
      i.disabled = !on;
      i.closest(".bundle").hidden = !on;
      if (on && i.dataset.qty === keepQty) picked = i;
    });
    const first = optionInputs.find((i) => i.dataset.tier === t);
    (picked || first).checked = true;

    // Themes only apply to the Portrait Tag. Disabled inputs aren't submitted.
    const themed = t === "tag";
    themeStep.hidden = !themed;
    themeInputs.forEach((i) => (i.disabled = !themed));
    if (petsStepNum) petsStepNum.textContent = themed ? "4" : "3";
    render();
  }

  function render() {
    const o = option();
    if (!o) return;
    const b = info(o);
    petRows.forEach((row) => {
      const on = Number(row.dataset.pet) <= b.qty;
      row.hidden = !on;
      $$("input", row).forEach((i) => (i.disabled = !on));
    });
    $$("[data-total]").forEach((el) => (el.textContent = P.money(b.price)));
    $$("[data-sticky-price]").forEach((el) => (el.textContent = P.money(b.price)));
    $$("[data-sticky-name]").forEach((el) => (el.textContent = b.name));
    variantField.value = b.variant;
    hideError();
  }

  tierInputs.forEach((i) => i.addEventListener("change", () => setTier(i.value)));
  optionInputs.forEach((i) => i.addEventListener("change", render));

  // "Choose the …" buttons on the tier cards preselect the tier.
  $$("[data-choose-tier]").forEach((btn) =>
    btn.addEventListener("click", () => setTier(btn.dataset.chooseTier))
  );

  /* Photo previews and checks. */
  $$("[data-photo]", form).forEach((input) => {
    input.addEventListener("change", () => {
      const row = input.closest(".pet-row");
      const img = $("[data-preview]", row);
      const empty = $(".upload-empty", row);
      const file = input.files && input.files[0];
      if (!file) {
        img.hidden = true;
        empty.hidden = false;
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
      if (img.src) URL.revokeObjectURL(img.src);
      img.src = URL.createObjectURL(file);
      img.hidden = false;
      empty.hidden = true;
      row.classList.remove("is-missing");
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

  /* Submit: validate, then post to Shopify's /cart/add (multipart, with files). */
  form.addEventListener("submit", (e) => {
    const b = info(option());
    const missing = [];
    petRows
      .filter((row) => !row.hidden)
      .forEach((row) => {
        const photo = $("[data-photo]", row);
        const name = $("[data-name]", row);
        const n = row.dataset.pet;
        const noPhoto = !(photo.files && photo.files.length);
        const noName = !name.value.trim();
        row.classList.toggle("is-missing", noPhoto || noName);
        if (noPhoto) missing.push(`a photo for pet ${n}`);
        if (noName) missing.push(`a name for pet ${n}`);
      });

    if (missing.length) {
      e.preventDefault();
      showError(`Please add ${missing.join(" and ")}.`);
      $(".is-missing", form)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const props = {
      contents: [{ content_id: `${P.PRODUCT_ID}-${b.id}`, content_name: `${P.PRODUCT} (${b.name})`, quantity: 1, price: b.price }],
      value: b.price,
      currency: P.CONFIG.currency,
    };
    P.track("AddToCart", props);

    if (!P.CONFIG.store || !b.variant) {
      e.preventDefault();
      $("[data-checkout-note]").hidden = false;
      P.toast("Checkout isn't connected yet");
      console.warn("[Pawse] Set CONFIG.store in assets/app.js and data-variant on each option in portrait/index.html.");
      return;
    }

    P.track("InitiateCheckout", props);
    // Don't send an empty gift note (re-enabled if the shopper comes back to the page).
    const note = $('textarea[name="properties[Gift note]"]', form);
    if (note && !note.value.trim()) note.disabled = true;
    form.action = `${P.CONFIG.store}/cart/add`;
    // Let the browser submit the form normally (it carries the photo files).
  });

  // Coming back from the cart with the browser's back button: restore the form.
  window.addEventListener("pageshow", () => {
    const note = $('textarea[name="properties[Gift note]"]', form);
    if (note) note.disabled = false;
  });

  setTier(tier());
})();
