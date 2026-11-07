# Pawse: pet product landing pages

Single-product landing pages for a small pet brand, built for traffic from TikTok videos and ads.
They're plain HTML, CSS and JavaScript with no build step, so they load fast in TikTok's in-app
browser and can be hosted anywhere for free.

| Page | Product | Live URL (GitHub Pages) |
|---|---|---|
| `index.html` | Suction-cup dog lick mat | https://yassinesr.github.io/rdp/ |
| `cat/index.html` | Desk Perch, a cat hammock that clamps to a desk | https://yassinesr.github.io/rdp/cat/ |

Every buy button sends shoppers straight to **Shopify checkout**, so payments, orders and policies
live in one Shopify store. Both pages share the same styles, script and store settings.

```
index.html          lick mat page
cat/index.html      cat desk perch page
assets/styles.css   shared styling (colours are at the top)
assets/app.js       shared settings + bundles, checkout, delivery dates, sticky bar, TikTok Pixel
assets/og.png       share preview for the lick mat page
assets/og-cat.png   share preview for the cat page
assets/favicon.svg  browser tab icon
```

## Preview locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 and http://localhost:8080/cat/. Until you connect Shopify, the buy
button shows "Checkout isn't connected yet". That's expected.

## Connect the pages to your store

### 1. Create the products in Shopify

Create one product per page, with one variant per bundle. Prices must match the page:

| Product | Variant | Price |
|---|---|---|
| Pawse Suction Lick Mat | 1 mat | $17.99 |
| | 2 mats | $27.99 |
| | 3 mats + spreader | $34.99 |
| Pawse Desk Perch | 1 perch | $29.99 |
| | 1 perch + spare cover | $34.99 |
| | 2 perches | $49.99 |

Find each variant's ID: open the product in Shopify admin, click the variant, and copy the number
at the end of the URL (`.../variants/44012345678901`).

### 2. Paste the IDs and prices into each page

Each bundle in a page's "Pick your bundle" section has `data-price` and `data-variant`:

```html
<input type="radio" name="bundle" value="duo" data-qty="2" data-price="27.99" data-variant="44012345678901">
```

Price labels, the per-item price and "save $X" text are calculated from `data-price`.
A bundle with `data-note="..."` shows that text instead, as the "perch + spare cover" bundle does.

### 3. Fill in the shared settings at the top of `assets/app.js`

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
- **tiktokPixelId**: once set, each page fires `ViewContent`, `AddToCart` and
  `InitiateCheckout`, labelled with that page's product (`data-product` on `<body>`). Install the
  TikTok app in Shopify too, so purchases on the checkout page are tracked.
- **deliveryDays**: drives the "estimated delivery" dates. Set it to what your shipping line
  actually achieves.

### 4. Check the brand name

"Pawse" is a placeholder. Before you use it, search the
[USPTO trademark database](https://tmsearch.uspto.gov/) and TikTok/Amazon for an existing pet
brand with the same name. To rename, search and replace `Pawse` across both pages, then
regenerate the share images.

## Put it online

**GitHub Pages (free):** repo **Settings → Pages → Deploy from a branch → `main` / root**.

**Netlify (free):** drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

`og:url` and `og:image` on each page point at the GitHub Pages address. If you move to a custom
domain or another host, update both, because social apps need an absolute URL to show the
preview.

## Before you run ads: launch checklist

Each page makes promises, and each one has to be true.

**Both pages**
- [ ] **Shipping promise is real.** "Ships in 1–3 business days" and "7–12 business days delivery"
      must match your fulfilment line. Use a **DDP** line (duties paid), because the pages promise
      "duties included, no surprise fees".
- [ ] **Your refund policy offers the 30-day money-back guarantee**, or remove that promise.
      Shopify can generate policy templates under **Settings → Policies**.
- [ ] **Real photos or video.** Swap each hero illustration for your own footage of a pet using
      the product. That's what converts on TikTok.
- [ ] **Only real reviews.** The pages ship with no reviews, "best seller" or "as seen on" claims on
      purpose. Add genuine customer reviews and videos once you have them. Fake reviews break FTC
      rules and TikTok's ad policy.
- [ ] **Test checkout end to end** on a phone, including the TikTok in-app browser.

**Lick mat specs** (edit "The details" if your supplier's differ): about 20 × 20 cm, food-grade
BPA-free silicone, suction-cup back, dishwasher and freezer safe.

**Desk perch specs** (edit "The details", the chips at the top and the FAQ if they differ): bed about
40 × 30 cm, **holds cats up to 9 kg (20 lb)**, fits desk tops up to about 6 cm thick, steel frame
with padded clamp, removable machine-washable cover, no tools needed. The weight limit and clamp
range are safety claims, so confirm them with the supplier *and* test a sample yourself.

## Sourcing checklist (1688 / Alibaba / Yiwu)

**Lick mat**
- Food-contact silicone test report (FDA 21 CFR 177.2600 for the US, LFGB for the EU), BPA-free.
- Weight per mat (aim for under 150 g) and suction strength on tile and glass.
- Silicone spreader spatula for the 3-mat bundle.

**Desk perch**
- **Load rating and a load-test video** at the advertised weight, with the clamp on a real desk.
- **Clamp opening range** (minimum and maximum desk thickness) and whether the grips are padded.
- **Shipping box size and weight.** Air lines charge by whichever is bigger: real weight or
  *volumetric* weight (length × width × height in cm ÷ 6000, or the divisor your line uses).
  A 40 × 30 × 6 cm box counts as 1.2 kg even if it weighs less, so ask for flat-pack packaging.
- **Spare covers** sold separately, for the "perch + spare cover" bundle.

**Both**
- MOQ for a printed logo and your own retail box.
- **DDP shipping line to the US**: price per 100 g (or per kg), real door-to-door days, and whether
  duties and the customs entry fee are included.
- Ask your supplier or freight forwarder which HS (customs) code they declare each product under,
  then check its US duty rate at [hts.usitc.gov](https://hts.usitc.gov/), plus any extra China
  tariffs in force when you ship.

## Unit economics worksheet

Fill this in per bundle before setting prices or ad budgets:

| Line | Bundle A | Bundle B | Bundle C |
|---|---|---|---|
| Price | | | |
| − Product cost (incl. packaging) | | | |
| − DDP shipping + duties to the US | | | |
| − Payment fees (about 3% + $0.30) | | | |
| − Refund/loss allowance (about 5%) | | | |
| **= Contribution before ads** | | | |
| Break-even cost per purchase on ads | = contribution | | |

If your TikTok cost per purchase is above the break-even line, raise prices, cut costs, or push the
bigger bundles harder.
