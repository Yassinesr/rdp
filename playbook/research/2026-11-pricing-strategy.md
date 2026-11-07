# Pricing strategy: 3D pet portrait line (November 2026)

Prices for the two keepsake pages, [`/tag/`](../../tag/index.html) and
[`/relief/`](../../relief/index.html), and the reasoning behind them. Product costs use Pinduoduo
retail prices until 1688 factory quotes arrive, so real profit should be **higher** than shown.

## The price list

| Product | 1 pet | 2 pets | 3 pets | Add-on on its page |
|---|---|---|---|---|
| **3D Portrait Tag** (`/tag/`) | **$29** | **$49** ($24.50 each, save $9) | **$69** ($23 each, save $18) | + Sculpted Relief Keychain of pet 1: **+$39** (normally $49, save $10) |
| **Sculpted Relief Keychain** (`/relief/`) | **$49** | **$89** ($44.50 each, save $9) | n/a | + matching Portrait Tag of pet 1: **+$19** (normally $29, save $10) |

**Keepsake set (Tag + Relief, same pet) = $68 from either page.** Free tracked shipping, duties
and the gift box are included in every price.

## Why these prices

1. **Anchored to what US shoppers already pay** (see [research 6d](2026-11-product-research.md#6d-update-aliexpress-alibaba-temu-and-us-competitors-7-nov-2026)):
   - **Relief Keychain at $49** matches MemoryMint's raised-relief leather keychain ($49), and
     sits above Pockella's "from $39". Our extras are a preview before production, a gift box
     and free shipping. Going lower would leave thin profit at the current cost (about ¥138).
   - **Portrait Tag at $29** is below Etsy relief keychains (from about $32) and Pockella, and
     close to the TikTok jewelry median (about $23). It's the impulse-friendly entry point.
2. **Round prices ($29, not $29.99).** A pet portrait is an emotional purchase. In
   Wadhwa & Zhang's 2015 *Journal of Consumer Research* studies, rounded prices raised purchase
   intent for feelings-driven purchases, while ".99"-style prices worked better for practical ones
   ([paper](https://ideas.repec.org/a/oup/jconrs/doi10.1086-678484.html),
   [summary](https://sciencedaily.com/releases/2015/01/150122084344.htm)).
3. **Multi-pet ladder.** Each extra pet costs less ($20 for each extra tag, $40 for the second
   keychain), following Etsy's multi-pet pricing (2 pets $39, 3 pets $56 for one piece). Bigger
   orders share one parcel, so each extra pet adds a lot of profit for little shipping.
4. **One add-on, right next to the buy button.** Checkout guides recommend a single, closely
   related add-on, because several cause decision fatigue
   ([SamCart](https://www.samcart.com/blog/the-complete-guide-to-order-bumps),
   [Tagada](https://www.tagada.io/glossary/order-bump)). Vendor-reported take rates are about
   8–15% (unverified). The Relief page's +$19 tag fits the common "30–50% of the main item" rule.
   The Tag page's +$39 relief works as an upgrade, so test it (see below).
5. **Honest savings only.** "Save $X" is always against buying the same items separately at
   our own prices. There are no made-up "was" prices.

## Profit per order (contribution before ads)

**Assumptions:**
- **Product cost:** tag ¥27.9 ≈ $3.88, relief ¥137.75 ≈ $19.13 (Pinduoduo, ¥7.2 per $1)
- **Packaging:** gift box $1.25 per piece (assumed)
- **Shipping with duties paid:** $4–6 for one tag and $5–8 for one relief (assumed), plus
  $1.50–3 for each extra piece in the same parcel
- **Card fees and refunds:** card fees 2.9% + $0.30; refund allowance 3%

| Order | Price | Contribution before ads |
|---|---|---|
| 1 tag | $29 | **$15.86–17.86** |
| 2 tags | $49 | **$26.55–30.05** |
| 3 tags | $69 | **$37.24–42.24** |
| 1 relief | $49 | **$17.43–20.43** |
| 2 reliefs | $89 | **$31.69–36.19** |
| Tag + relief set | $68 | **$27.18–31.68** (+$10–14 over a single item) |

**What this means for marketing:**
- **Single items** ($16–20) can't pay for cold paid ads (about $30–50 per sale; see
  [guide 4](../04-tiktok-channels-and-ads.md)). They sell through organic videos and creators:
  a 15% creator commission on $29 is $4.35, which leaves about $11–13.
- **Multi-pet orders and sets** ($27–42) are what make paid ads possible later. The page design
  pushes them with the "Our pick" option, the add-on and the cross-sell section.
- **If the relief factory cost comes in around ¥90–100** (as for the bare medallion SKU), single
  relief profit rises to about $23–27.

## Shopify options to create

Each line is one option (variant) with its own price. Put its ID in the page's `data-variant`
(no add-on) or `data-variant-bump` (with add-on).

| Product | Option | Price | Page attribute |
|---|---|---|---|
| 3D Portrait Tag | 1 pet | $29 | `/tag/` pets=1 `data-variant` |
| | 2 pets | $49 | pets=2 `data-variant` |
| | 3 pets | $69 | pets=3 `data-variant` |
| | 1 pet + Relief Keychain | $68 | pets=1 `data-variant-bump` |
| | 2 pets + Relief Keychain | $88 | pets=2 `data-variant-bump` |
| | 3 pets + Relief Keychain | $108 | pets=3 `data-variant-bump` |
| Sculpted Relief Keychain | 1 pet | $49 | `/relief/` pets=1 `data-variant` |
| | 2 pets | $89 | pets=2 `data-variant` |
| | 1 pet + Portrait Tag | $68 | pets=1 `data-variant-bump` |
| | 2 pets + Portrait Tag | $108 | pets=2 `data-variant-bump` |

## What to test once orders come in

The thresholds below are working rules, not benchmarks.
1. **Tag price: $29 vs $34.** Run once there are about 50 orders. Keep $34 if conversion drops
   less than about 15%.
2. **Tag-page add-on: +$39 vs +$35.** Watch how often it's taken. Under about 5% means it's
   too expensive or too big a jump from a $29 tag.
3. **Share of multi-pet orders.** If fewer than about 15% of orders are 2+ pets, make the
   2-pet option the default.
4. **Recheck everything** when 1688 quotes and real shipping quotes arrive (see
   [cost model](../02-cost-model.md)).
