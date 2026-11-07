# 2. Cost model

Work out, before you spend anything, how much each order really earns and the most you can afford
to pay to get a sale. Fill in the inputs with **your own quotes**. The example numbers below are
labelled as either sourced or assumed.

## 2.1 The formulas

```
Billed weight (kg)        = max(actual kg, L × W × H in cm ÷ 6000)    some lines divide by 5000
Landed cost               = product + packaging + shipping + duties (if not included in shipping)
Fees                      = payment or platform fees (% of price + fixed)
Refund allowance          = expected refund rate × price
Contribution before ads   = price − landed cost − fees − refund allowance
Profit per order          = contribution before ads − cost of getting the sale
Cost of getting the sale  = creator commission % × price  OR  ad cost per purchase (CPA)
Break-even CPA            = contribution before ads
Break-even ROAS           = price ÷ contribution before ads
Ad CPA (estimate)         = CPC ÷ conversion rate  =  CPM ÷ (1000 × CTR × conversion rate)
```

**Rule of thumb used in this playbook:** don't test a product unless contribution before ads is
**at least $15** at a price you can realistically charge. Below that, neither creators nor ads leave
enough profit. This is a planning rule, not an industry standard.

## 2.2 Inputs and where the numbers come from

### Shipping from China

| Option | Price signal | Transit | Source |
|---|---|---|---|
| Duties-paid (DDP) parcel lines to US | 0.5 kg about $11–18 all-in | 7–13 business days | [NextSmartShip](https://www.nextsmartship.com/blog/ship-from-china-to-us/) |
| Economy duties-paid line | about $26 for 1 kg, about $97 for 5 kg (about $18 per extra kg) | n/a | [Fishgoo](https://blog.fishgoo.com/china-shipping-cost-estimator/) |
| CJPacket (via CJ Dropshipping) | roughly $2–6 for small items, rising with weight | about 7–15 days | [Spocket review](https://www.spocket.co/blogs/cjdropshipping-overview), [CJ](https://blog.cjdropshipping.cn/detail/the-price-of-epacket-had-increased-why-not-try-out-effective-cjpacket) |
| Bulk freight (air or sea, per kg) | about $4–10/kg air DDP (bulk) | days to weeks | [AEB Logistics](https://aeblogistics.com/ddp-shipping-rates-china-to-usa/), [Shipvida](https://www.shipvida.com/articles/ddp-shipping-cost-from-china-explained) |

These are forwarder marketing figures and they vary a lot. **Get 2–3 written quotes** for your
actual box (see 2.5).

### US duties (when duties aren't included in the shipping price)

As of November 2026 (details in [guide 6](06-legal-tax-payments.md#64-us-import-duties)):

```
duty = customs value × (normal duty rate + 2018 China list rate (0, 7.5% or 25% typically) + 12.5%)
```

- **Customs value** for a parcel sold to a US shopper is normally **the price the shopper paid**.
  For bulk stock you import yourself, it's what you paid the supplier. That difference is one
  reason bulk import is cheaper per unit.
- The duty-free allowance for parcels under $800 no longer applies to China.

### Store and platform fees

| Route | Fee | Source |
|---|---|---|
| Shopify store + Shopify Payments (Basic, US rates) | 2.9% + $0.30 per card payment | [Demandsage](https://www.demandsage.com/shopify-pricing/) |
| Shopify Payments, Hong Kong company | Rates vary by country; HK Stripe local cards quoted about 3.4% + HK$2.35 | [Shopify HK](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/hong-kong), [Airwallex](https://www.airwallex.com/en-hk/blog/ecommerce-payment-providers) |
| Shopify with a third-party gateway (e.g. PayPal) | Gateway fee **plus** a Shopify fee of 2% (Basic) / 1% (Grow) / 0.6% (Advanced) | [Demandsage](https://www.demandsage.com/shopify-pricing/) |
| PayPal (US schedule, Oct 2026) | Cards 2.99% + fixed fee; PayPal checkout 3.49% + fixed fee; +1.50% for international payments | [PayPal fee PDF](https://www.paypalobjects.com/marketing/ua/pdf/US/us-merchant-fees-01-october-2026.pdf) |
| TikTok Shop US | 6% referral fee, which includes payment processing (one report says 8% since Aug 2026, unconfirmed); new sellers 3% for 30 days | [LitCommerce](https://litcommerce.com/blog/tiktok-shop-fees/), [FastMoss](https://www.fastmoss.com/blog/tiktok-shop-seller-costs-in-the-us-2026-fees-creator-commissions-fulfillment-returns-real-profit/) |
| TikTok Shop UK | about 9% commission (third-party guides) | [EcomCalcTools](https://ecomcalctools.com/blog/fees-tiktok/tiktok-shop-uk/) |
| TikTok Shop creator (affiliate) commission | Average about 13%; beauty 15–25%; home 10–20% | [TTCalculator](https://ttcalculator.net/learn/tiktok-shop-commission-rates/), [Hamster Garage](https://www.hamstergarage.com/article/tiktok-shop-affiliate-statistics-benchmarks-roi) |
| Fulfilled by TikTok (US warehouse) | Reported from about $3.58–4.28 per unit, plus storage after a free period | [AMZ Prep](https://amzprep.com/tiktok-shop-fulfillment-fees/), [GetOneCart](https://getonecart.com/tiktok-shop-seller-fees/) |

### Getting the sale: ads benchmarks (TikTok, ecommerce)

| Metric | Range | Source |
|---|---|---|
| CPM (cost per 1,000 views) | about $4–5 for ecommerce; $9 cross-industry | [Lebesgue](https://lebesgue.io/tiktok-ads/tiktok-ads-benchmarks-for-ctr-cr-and-cpm), [Benly](https://benly.ai/learn/tiktok-ads/tiktok-ads-cost-benchmarks) |
| CPC (cost per click) | about $0.70–1.30 | [Conversion Studio](https://conversion.studio/blog/tiktok-ads-benchmarks), [Focus Digital](https://focus-digital.co/average-tiktok-ads-ctr-and-cpm-by-industry/) |
| CTR (click-through rate) | about 0.61% | Lebesgue |
| Conversion rate | about 1.56–1.92% | Lebesgue; Triple Whale figure in roundups |
| CPA (cost per purchase) | about $32.74 (2025 average) | Triple Whale figure, reported in the roundups above |

**What this means:** at an average CPC of $0.80–1.00 and a conversion rate of 1.56–1.92%, CPA works
out to **about $42–64**. The 2025 average reported was about $33. **Plan for $30–50 per sale on paid
ads** until your own data says otherwise. That's why cheap products should sell through organic
videos and creators first.

### Refunds

Returns average about 19–21% of online orders, but jewelry is about 4% and apparel about 25%
([Branvas](https://branvas.com/blogs/news/ecommerce-return-rate-by-category),
[Richpanel](https://www.richpanel.com/learn/ecommerce-return-rates)). Shipping returns back to China
rarely makes sense, so budget the **refund rate × price** as a cost: 3–5% for rigid, no-size items
and 10%+ for anything with sizing.

### Fixed monthly costs

Shopify Basic $39/mo ($29 billed yearly) · domain (about $10–15/yr) · a tracker tool ($10–45/mo) ·
samples · apps. Divide these by monthly orders when you check profit; at low volume they matter.

## 2.3 Worked examples

Exchange rate assumed: **¥7.2 = $1**. Check the current rate.

### Example A: Lick mat 2-pack, your own store, shipped duties-paid from China

| Line | Amount | Basis |
|---|---|---|
| Price | $27.99 | Page price |
| Product (2 mats) | −$1.67 | **Assumed** ¥6/mat; get a quote |
| Packaging | −$0.30 | Assumed |
| Duties-paid shipping, about 0.35 kg billed | −$9 to −$14 | Assumed from the forwarder ranges above |
| Card fees (2.9% + $0.30) | −$1.11 | Shopify Payments rate |
| Refund allowance (5%) | −$1.40 | Assumed |
| **Contribution before ads** | **$9.51 to $14.51** | |
| With a creator at 15% | **$5.31 to $10.31** profit | |
| With paid ads at $33 per sale | **−$18 to −$23** loss | |
| Break-even ROAS | 1.9 to 2.9 | |

**Verdict:** workable through organic videos and creators. Paid ads lose money unless a proven video
gets cost per sale under about $10. Raise the order value with the 3-mat bundle ($34.99).

### Example B: Cat desk perch

Sourced inputs: supplier price ¥60 (≈ $8.33); box 37 × 25 × 7.5 cm, 875 g, so **billed weight
1.16 kg** (÷6000) or 1.39 kg (÷5000).

**B1. Shipped duties-paid from China, one parcel per order, at $29.99**

| Line | Amount |
|---|---|
| Price | $29.99 |
| Product | −$8.33 |
| Duties-paid shipping, about 1.2 kg | −$20 to −$30 (assumed from forwarder ranges) |
| Fees + refunds (3% + $0.30, 5%) | −$2.70 |
| **Contribution before ads** | **−$1 to −$11 (a loss)** |

**B2. Bulk import to a US warehouse, at $29.99 and at $44.99**

| Line | $29.99 | $44.99 | Basis |
|---|---|---|---|
| Product | −$8.33 | −$8.33 | Supplier price |
| Bulk freight to the US, per unit | −$1.50 to −$3.00 | same | **Assumed**; get a freight quote |
| Duty on $8.33 at 12.5–37.5% | −$1.04 to −$3.12 | same | Depends on the HS code's China list status |
| Warehouse pick & pack | −$3.20 | −$3.20 | Survey average of 600+ warehouses ([Fulfill.com](https://www.fulfill.com/3pl-pricing)) |
| US postage, about 2 lb | −$9 to −$12 | same | **Assumed**; a 1 lb zone 5 commercial label was $8.74 after the Apr 2026 price change ([Ship.com](https://www.ship.com/post/usps-commercial-rates-explained), [Ship.com](https://www.ship.com/post/usps-ground-advantage-vs-priority-mail-2026)) |
| Fees + refunds | −$2.70 | −$3.90 | |
| **Contribution before ads** | **−$2.36 to +$4.22** | **+$11.44 to +$18.02** | |

**Verdict:** the perch only works at about $45 with bulk import, and similar beds sell for about
$27 on TikTok Shop. **Parked.** Bulk import also needs upfront stock: 100 units is about ¥6,000 plus
freight, warehouse minimums (often $500–2,500 a month, per 2026 3PL pricing guides such as
[Catalist](https://catalistai.com/blog/3pl-fulfillment-cost-breakdown-2026/) and [Fulfill.com](https://www.fulfill.com/3pl-pricing)),
and **CPSC eFiling** if the product falls under a CPSC rule.

### Example C: Personalized name necklace (template; replace the assumed lines)

| Line | Amount | Basis |
|---|---|---|
| Price | $34.99 | Target |
| Product incl. engraving | −$2.08 | **Assumed** ¥15; get a quote |
| Gift pouch or box | −$0.50 | Assumed |
| Duties-paid shipping, about 0.1 kg | −$7 to −$11 | **Assumed** (light parcels cost less than the 0.5 kg $11–18 band) |
| Card fees | −$1.31 | 2.9% + $0.30 |
| Refund allowance (3%) | −$1.05 | Jewelry returns about 4% |
| **Contribution before ads** | **$19.05 to $23.05** | |

**Verdict:** this is the profile to look for: light, cheap to make, easy to gift, few returns.
Contribution clears the $15 rule. After a 15% creator commission it's still about $14–18 per order.

## 2.4 What changes the answer most

1. **Billed weight.** Every extra 0.5 kg costs roughly $8–10 on duties-paid parcel lines.
2. **Price and bundle size.** Shipping a 2-pack costs far less than double a 1-pack.
3. **Cost of getting the sale.** Paid ads at $30–50 vs a creator at 10–20% of the price.
4. **Refunds and damage.** Fragile or sized products quietly eat 5–15%.

## 2.5 Shipping quote checklist (ask every forwarder or line)

- Price per kg **and** per-parcel handling fee; minimum billable weight
- Volumetric divisor (6000 or 5000)
- Does "duties-paid" (包税) include **all** US duties, including the 12.5% China duty? On what
  declared value? (It should be the real sale price; under-declaring risks seizure.)
- Door-to-door transit in business days, with tracking from pickup to delivery
- Peak-season surcharges (October–December) and remote-area fees
- Compensation for lost or damaged parcels
- Whether they handle CPSC eFiling where it's required
