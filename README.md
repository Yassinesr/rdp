# Pawse: pet product landing pages

> **Running the shop:** the [`playbook/`](playbook/README.md) folder has the full guide set:
> product research, cost model, store and website, TikTok channels and ads, sourcing and
> fulfillment, legal/tax/payments, and the launch plan.

Single-product landing pages for a small pet brand, built for traffic from TikTok videos and ads.
They're plain HTML, CSS and JavaScript with no build step, so they load fast in TikTok's in-app
browser and can be hosted anywhere for free.

| Page | Product | Live URL (GitHub Pages) |
|---|---|---|
| `index.html` | Suction-cup dog lick mat | https://yassinesr.github.io/rdp/ |
| `cat/index.html` | Desk Perch, a round cat bed that clamps to a desk (parked: see playbook) | https://yassinesr.github.io/rdp/cat/ |
| `tag/index.html` | **3D Portrait Tag** (custom pet portrait, from $29), with the Relief Keychain as an add-on | https://yassinesr.github.io/rdp/tag/ |
| `relief/index.html` | **Sculpted Relief Keychain** (premium pet portrait, from $49), with a matching Tag as an add-on | https://yassinesr.github.io/rdp/relief/ |

Every buy button sends shoppers straight to **Shopify checkout**, so payments, orders and policies
live in one Shopify store. Both pages share the same styles, script and store settings.

```
index.html          lick mat page
cat/index.html      cat desk perch page
tag/index.html      3D Portrait Tag page (one product, photo upload, live mock-up, add-on, gift box)
relief/index.html   Sculpted Relief Keychain page (same layout, premium)
assets/styles.css   shared styling (colours are at the top)
assets/app.js       shared settings + bundles, checkout, delivery dates, order-by dates, sticky bar, TikTok Pixel
assets/keepsake.js  keepsake order form: pets, theme, photos, names, add-on, live mock-up → Shopify cart
assets/og.png       share preview for the lick mat page
assets/og-cat.png   share preview for the cat page
assets/og-tag.png   share preview for the Portrait Tag page
assets/og-relief.png share preview for the Relief Keychain page
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
| Pawse Desk Perch | 1 perch (plush cover) | $29.99 |
| | All-season set (plush + mesh covers) | $36.99 |
| | 2 perches (plush) | $49.99 |
| Pawse 3D Portrait Tag | 1 pet / 2 pets / 3 pets | $29 / $49 / $69 |
| | same + Relief Keychain add-on | $68 / $88 / $108 |
| Pawse Sculpted Relief Keychain | 1 pet / 2 pets | $49 / $89 |
| | same + Portrait Tag add-on | $68 / $108 |

The full option list, with where each ID goes, is in
[the pricing strategy](playbook/research/2026-11-pricing-strategy.md#shopify-options-to-create).

Find each variant's ID: open the product in Shopify admin, click the variant, and copy the number
at the end of the URL (`.../variants/44012345678901`).

### 2. Paste the IDs and prices into each page

Each bundle in a page's "Pick your bundle" section has `data-price` and `data-variant`:

```html
<input type="radio" name="bundle" value="duo" data-qty="2" data-price="27.99" data-variant="44012345678901">
```

Price labels, the per-item price and "save $X" text are calculated from `data-price`.
A bundle with `data-note="..."` shows that text instead, as the desk perch bundles do.

### Portrait Tag and Relief Keychain pages: photo uploads

These pages don't use cart links. Their order form posts straight to your store's
`/cart/add` (as `multipart/form-data`) with these **line-item properties**, which show on the
order in Shopify admin:

| Property | From |
|---|---|
| `Theme` | Rainbow / Balloons / Flowers / Hearts / Snow (Tag page) |
| `Tag theme` | Theme for the add-on tag (Relief page, only when the add-on is ticked) |
| `Pet 1 photo`, `Pet 2 photo`, `Pet 3 photo` | Uploaded image files (up to 15 MB each, checked in the browser) |
| `Pet 1 name`, … | Text, up to 14 characters |
| `Gift note` | Optional, up to 150 characters, for the card in the gift box |

After adding to the cart, Shopify sends the shopper to `/checkout` (`return_to`). On each page,
the `name="pets"` radios carry `data-variant` (no add-on) and `data-variant-bump` (with add-on).
Prices and savings come from `data-price`, and the add-on's price from `data-price` /
`data-full-price` on the checkbox.

**Test it before launch:** place a test order and confirm the photo link and name appear on the
order. If your store blocks file uploads this way, the fallback is to drop the file inputs and
email customers after checkout for their photo.

The page promises a **delivery estimate of 11–19 business days** (preview 2 + production 3–5 +
shipping 7–12), set with `data-delivery-min/max` on `<body>`, and shows
**"Order by ___ for Christmas / Valentine's Day / Mother's Day"**, worked out from
`data-deadlines` on `<body>`. Update both if your supplier or shipping line is faster or slower.

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

**Desk perch specs** come from the supplier listing below: round bed about 37 cm across, steel
frame, swivels and tightens in place, plush or mesh cover that slides off the frame, spring teaser
toy (about 33 cm), **holds cats up to 11 kg (25 lb)**. The listing says "25 lbs (12 kg)", which
don't match, so the page uses the lower figure. The weight limit is a safety claim: test a sample
on a real desk before selling. Once the supplier confirms the clamp's desk-thickness range, add it
to "Fits" in the details and to the "Will it fit my desk?" FAQ answer.

**Portrait Tag and Relief Keychain promises** (edit the pages if any of these change):
- **Preview within 2 business days, one free revision.** You forward the supplier's 3D preview
  to the customer by email and wait for approval. Make sure the supplier commits to this speed.
- **Made in 3–5 business days after approval.**
- **"Damaged or not like your photo? We remake it or refund you" (30 days).** Put this in your
  refund policy; personalized items are otherwise often non-refundable.
- **Gift box with a padded insert and a card printing the gift note**, no prices inside. Source
  the box (see the playbook research, packaging search terms); budget about $1–1.50 per box.
- **Materials:** the page says "faux leather" and "painted in full color". Confirm with the
  supplier (if the relief is genuinely hand-painted, you can say so; if the leather is real,
  you can say that too).
- **Sizes:** only the Relief Keychain's "about 8 cm" frame is stated (from the listing).
  Add the Portrait Tag's size once you've measured a sample.

## Sourcing checklist (1688 / Alibaba / Yiwu)

**Lick mat**
- Food-contact silicone test report (FDA 21 CFR 177.2600 for the US, LFGB for the EU), BPA-free.
- Weight per mat (aim for under 150 g) and suction strength on tile and glass.
- Silicone spreader spatula for the 3-mat bundle.

**Desk perch: current supplier (1688 offer 978904434328)**

Ships from Zhejiang. Item no. 3007, brand 茜朵, made for export (跨境出口专供), and no licensable
brand, so you can sell it under your own. Its listed downstream platforms include Amazon and
independent stores.

| Version (规格) | Gross weight | Box size | Billed weight* |
|---|---|---|---|
| 3007 plush (绒布款) | 875 g | 37 × 25 × 7.5 cm | about 1.16 kg |
| 3007 mesh (网眼布款) | 845 g | 37 × 25 × 7.5 cm | about 1.16 kg |
| 3007 clear PS bowl (透明罩款) | 1,488 g | 37.8 × 36.7 × 8 cm | about 1.85 kg |

\*Air lines charge by whichever is bigger: real weight or *volumetric* weight (length × width ×
height in cm ÷ 6000). Some lines divide by 5000, which makes it higher. Use the plush and mesh
versions: the clear bowl costs about 60% more to ship and can crack in transit.

Still to confirm with the supplier:
- [ ] **Price per SKU** and price breaks, plus the dropshipping (一件代发) price.
- [ ] **Clamp range**: minimum and maximum desk thickness (适用桌面厚度).
- [ ] **Load-test video** at 11 kg, and whether the clamp has protective pads.
- [ ] **Mesh cover sold on its own** (for the all-season set), and its price and weight.
- [ ] **Permission to use their product photos and videos**, until you have your own.
- [ ] **Custom logo or packaging**, and the minimum order for it.

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
