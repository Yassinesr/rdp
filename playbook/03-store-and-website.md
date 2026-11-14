# 3. Store and website

What the shop runs on, how to add products quickly, and what TikTok requires before it will send
ad traffic to your page.

## 3.1 Three ways to sell, and which pages each needs

| Route | Website you need | Checkout | Best for |
|---|---|---|---|
| **A. Own store + landing pages** (what this repo does) | Fast single-product pages (this repo) + a Shopify store | Shopify checkout via cart links | Products sold through organic videos, creators' link-in-bio, and TikTok ads |
| **B. TikTok Shop** | None: the listing lives inside TikTok | TikTok's own checkout | Highest conversion inside the app; creators can tag the product |
| **C. Both** | A + B | Both | Normal once a product proves itself: TikTok Shop for in-app buyers, own store for ads and repeat customers |

Route B's seller rules (US warehouse, deposit, delivery times) are in
[guide 4](04-tiktok-channels-and-ads.md).

## 3.2 Recommended stack for route A

| Piece | Choice | Cost | Why |
|---|---|---|---|
| Product pages | This repo: static HTML/CSS/JS on GitHub Pages | Free | Loads fast in TikTok's in-app browser, with no theme bloat |
| Checkout, orders, policies | Shopify **Basic** | $39/mo, or $29/mo billed yearly ([Demandsage](https://www.demandsage.com/shopify-pricing/)) | Trusted checkout, order management, policy pages, TikTok app |
| Payments | Shopify Payments if you have a Hong Kong (or other supported) company; otherwise PayPal + another gateway | see [guide 6](06-legal-tax-payments.md#66-getting-paid) | Using a non-Shopify gateway adds a 2% Shopify fee on Basic |
| Domain | Your own (e.g. `yourbrand.com`) | about $10–15/yr | A custom domain looks more trustworthy than `github.io` in ads. Point it at GitHub Pages and use a `shop.` subdomain for Shopify |
| Tracking | TikTok Pixel on the pages + TikTok app in Shopify for checkout and purchase events | Free | See 3.5 |

**China note:** Google Fonts and GitHub Pages can be slow or blocked when *you* preview from
mainland China, but US shoppers aren't affected. The pages fall back to system fonts if Google
Fonts doesn't load.

## 3.3 Dynamic site: one data file per product

Right now each product page is a hand-edited HTML file. To launch products quickly, switch to
**build-time generation**: each product is described in one data file, and a small script turns
every data file into a page using one shared template.

```
products/
  lick-mat.json          ← everything about one product
  name-necklace.json
templates/
  product.html           ← one page layout with placeholders
assets/                  ← shared CSS, JS, images
scripts/build.mjs        ← reads products/*.json → writes /<slug>/index.html
```

**What goes in a product file:**

```json
{
  "slug": "lick-mat",
  "status": "live",
  "brand": "YourBrand",
  "name": "YourBrand Suction Lick Mat",
  "seo": { "title": "...", "description": "...", "ogImage": "assets/og-lick-mat.png" },
  "hero": { "eyebrow": "...", "headline": "...", "lead": "...", "chips": ["...", "..."], "art": "lick-mat.svg" },
  "steps": [{ "title": "Spread", "text": "..." }],
  "uses": [{ "icon": "bath", "title": "Bath time", "text": "..." }],
  "unit": "mat",
  "bundles": [
    { "id": "single", "name": "1 mat", "qty": 1, "price": 17.99, "variantId": "" },
    { "id": "duo", "name": "2 mats", "qty": 2, "price": 27.99, "variantId": "", "badge": "Our pick", "default": true }
  ],
  "specs": [["Size", "About 20 × 20 cm"]],
  "tips": { "title": "Easy fill ideas", "items": ["..."] },
  "faq": [{ "q": "...", "a": "..." }],
  "finePrint": "Not a chew toy. Supervise your pet while it's in use.",
  "deliveryDays": { "min": 7, "max": 12 }
}
```

**Why build-time and not load-time:** the page stays plain HTML, so it's fast in the in-app
browser, readable by search engines, and works even if JavaScript fails. Adding a product means
adding one data file, then running `node scripts/build.mjs` (or letting a GitHub Action run it on
every push).

**Load-time alternative:** pull product data from Shopify's Storefront API in the browser. Prices
and stock would always match Shopify, but you'd need an API token in the page, it's slower on
first load, and it breaks if the API call fails. Only worth it with many products and frequent
price changes.

**Status:** the template and build script aren't built yet. The current two pages (`/` and
`/cat/`) already share one stylesheet and one script, so converting them is mostly moving the copy
into data files.

## 3.4 What every product page must have

**TikTok's landing-page rules** ([TikTok ad policy](https://ads.tiktok.com/help/article/tiktok-advertising-policies-ad-creatives-landing-page-ad-format-and-functionality?lang=en)):
- Prices in the shopper's local currency (USD for US ads)
- Terms and conditions, and shipping information
- Privacy policy, returns policy and refund policy

**Already on this repo's pages:** USD prices, shipping time, a refund promise, footer links to
Shopify policy pages. Before ads, make sure those Shopify policy pages exist and match what the
page promises.

**Conversion basics** (already built in):
- Clear outcome in the headline, real product demo near the top (replace the illustrations with
  video)
- Bundles with honest savings math. No fake "was" prices, because the reference price must be real
- Estimated delivery dates and duties-included messaging
- Sticky buy bar on phones
- No fake reviews, "best seller" badges or "as seen on" claims until they're true. See
  [guide 6](06-legal-tax-payments.md#68-advertising-and-consumer-law)

**Speed budget:** aim for under about 1 MB on first load. Compress images to WebP, keep hero video
under 2–3 MB and muted autoplay, and load only one web font. Test on a phone through the TikTok
in-app browser.

## 3.5 Tracking

- **Browser pixel** on product pages for early steps: `ViewContent`, `AddToCart`,
  `InitiateCheckout`. Already in `assets/app.js`; switch it on with `CONFIG.tiktokPixelId`.
- **Purchases** happen on Shopify's checkout, so install the **TikTok app in Shopify** to send them.
  Sources disagree on whether the app sends **server-side** events (Events API) automatically
  ([WeltPixel](https://weltpixel.com/blogs/news/tiktok-events-api-on-shopify-2026-setup-verification-guide)
  vs [Trackbee](https://trackbee.io/blog/tiktok-events-api-shopify-complete-setup-guide)). Check the
  app's data-sharing setting, then confirm with TikTok's **Test Events** tool.
- If both browser and server events are sent, they must share the same `event_id` so TikTok doesn't
  count a sale twice ([Megadigital](https://megadigital.ai/en/blog/tiktok-events-api/)).
- **UTM tags** on every link (creator bios, ads), so Shopify shows which video sold.

## 3.6 Policies and pages checklist

- [ ] Shipping policy: processing 1–3 business days, delivery 7–12 business days, duties included
- [ ] Refund policy: matches the page (e.g. 30 days); explain refund-without-return for low-value items if that's your policy
- [ ] Privacy policy: Shopify template plus pixel and analytics disclosure
- [ ] Terms of service
- [ ] Contact: an email that's monitored daily; a business name and address if your payment provider requires it
- [ ] About page: a short honest story ("a small team in China designing pet products") builds trust better than pretending to be a US brand
