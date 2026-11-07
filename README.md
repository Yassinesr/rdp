# Pawse: suction lick mat landing page

A single-product landing page for a suction-cup dog lick mat, built for traffic from TikTok
videos and ads. It's plain HTML, CSS and JavaScript with no build step, so it loads fast in
TikTok's in-app browser and can be hosted anywhere for free.

The buy button sends shoppers straight to **Shopify checkout**, so payments, orders and policies
live in your Shopify store.

```
index.html          the page
assets/styles.css   all styling (colours are at the top)
assets/app.js       settings + bundles, checkout, delivery dates, sticky bar, TikTok Pixel
assets/og.png       preview image shown when the link is shared
assets/favicon.svg  browser tab icon
```

## Preview it locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. Until you connect Shopify, the buy button shows
"Checkout isn't connected yet". That's expected.

## Connect it to your store

### 1. Create the product in Shopify

Create one product, **Pawse Suction Lick Mat**, with three variants that match the page:

| Variant | Price on the page |
|---|---|
| 1 mat | $17.99 |
| 2 mats | $27.99 |
| 3 mats + spreader | $34.99 |

Find each variant's ID: open the product in Shopify admin, click the variant, and copy the number
at the end of the URL (`.../variants/44012345678901`).

### 2. Paste the IDs and prices into `index.html`

Each bundle in the "Pick your bundle" section has `data-price` and `data-variant`:

```html
<input type="radio" name="bundle" value="duo" data-qty="2" data-price="27.99" data-variant="44012345678901" checked>
```

The price labels, per-mat price and "save $X" text are calculated from `data-price`, so you only
change the number in one place. Keep the page prices identical to Shopify's.

### 3. Fill in the settings at the top of `assets/app.js`

```js
const CONFIG = {
  store: "https://your-store.myshopify.com", // or your custom domain
  contactEmail: "hello@yourdomain.com",
  tiktokPixelId: "",                         // from TikTok Ads Manager > Events
  currency: "USD",
  deliveryDays: { min: 7, max: 12 },          // match your real shipping line
};
```

- **store**: checkout uses Shopify's cart link (`/cart/VARIANT_ID:1`), and the footer links to
  your Shopify policy pages (`/policies/refund-policy` and so on).
- **tiktokPixelId**: once set, the page fires `ViewContent`, `AddToCart` and
  `InitiateCheckout`. Install the TikTok app in Shopify too, so purchases on the checkout page are
  tracked.
- **deliveryDays**: drives the "estimated delivery" dates. Set it to what your shipping line
  actually achieves.

### 4. Change the brand name if you need to

"Pawse" is a placeholder. Before you use it, search the
[USPTO trademark database](https://tmsearch.uspto.gov/) and TikTok/Amazon for an existing pet
brand with the same name. To rename, search and replace `Pawse` across `index.html` and
`assets/app.js`, then regenerate `assets/og.png`.

## Put it online

**GitHub Pages (free):** repo **Settings → Pages → Deploy from a branch → `main` / root**.
The site appears at `https://<your-username>.github.io/<repo>/`.

**Netlify (free):** drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

`og:url` and `og:image` in `index.html` point at the GitHub Pages address
(`https://yassinesr.github.io/rdp/`). If you move to a custom domain or another host, update both,
because social apps need an absolute URL to show the preview.

## Before you run ads: launch checklist

The page makes promises. Each one has to be true.

- [ ] **Specs match your supplier.** Size (about 20 × 20 cm), food-grade BPA-free silicone,
      suction-cup back, dishwasher and freezer safe. Edit the "The details" section if anything
      differs.
- [ ] **Shipping promise is real.** "Ships in 1–3 business days" and "7–12 business days delivery"
      must match your fulfilment line. Use a **DDP** line (duties paid), because the page promises
      "duties included, no surprise fees".
- [ ] **Your refund policy offers the 30-day money-back guarantee**, or remove that promise from the
      page. Shopify can generate policy templates under **Settings → Policies**.
- [ ] **Real photos or video.** Swap the hero illustration for your own footage of a dog using the
      mat. That's what converts on TikTok.
- [ ] **Only real reviews.** The page ships with no reviews or "as seen on" claims on purpose. Add
      genuine customer reviews and videos once you have them. Fake reviews break FTC rules and
      TikTok's ad policy.
- [ ] **Test checkout end to end** on a phone, including the TikTok in-app browser.

## Sourcing checklist (1688 / Alibaba / Yiwu)

Ask the supplier for:

- **Material test report** for food-contact silicone (FDA 21 CFR 177.2600 for the US, LFGB for
  the EU) and confirmation it is BPA-free.
- **Weight per mat**, aiming for under 150 g so a 2-pack ships cheaply.
- **Suction strength sample.** Test it yourself on tile and glass with a pulling dog.
- **Colour options and MOQ for a printed logo and your own retail box.**
- **Spreader spatula** (silicone) for the 3-pack bonus.
- **DDP shipping line to the US**: price per 100 g, real door-to-door days, and whether duties
  and the customs entry fee are included.

Ask your supplier or freight forwarder which HS (customs) code they declare the mat under, then
check its US duty rate at [hts.usitc.gov](https://hts.usitc.gov/), plus any extra China tariffs
in force when you ship.

## Unit economics worksheet

Fill this in per bundle before setting prices or ad budgets:

| Line | 1 mat | 2 mats | 3 mats + spreader |
|---|---|---|---|
| Price | 17.99 | 27.99 | 34.99 |
| − Product cost (mats, spatula, packaging) | | | |
| − DDP shipping + duties to the US | | | |
| − Payment fees (about 3% + $0.30) | | | |
| − Refund/loss allowance (about 5%) | | | |
| **= Contribution before ads** | | | |
| Break-even cost per purchase on ads | = contribution | | |

If your TikTok cost per purchase is above the break-even line, raise prices, cut costs, or push
the 2- and 3-mat bundles harder.
