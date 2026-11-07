# 6. Legal, tax and payments

The rules that can get parcels seized, accounts frozen or fines issued. **This is general
information gathered from public sources in November 2026, not legal or tax advice.** Before you
register a company or start selling at volume, talk to an accountant who handles cross-border
ecommerce in China, and a US customs broker if you import in bulk.

## 6.1 Business setup options

| Setup | Opens | Watch out for |
|---|---|---|
| **Mainland China company** (or individual business, 个体户) | TikTok Shop cross-border (US/UK/EU) with a Chinese business license; 1688 business accounts; Chinese payment collectors (LianLian, PingPong, WorldFirst) | Shopify Payments isn't available, so you rely on PayPal and third-party gateways (plus Shopify's 2% fee on Basic) |
| **Hong Kong company** | **Shopify Payments** (HK is a supported country) and Stripe. One guide says you need HK Business Registration and a local bank account ([Shopify HK](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/hong-kong), [app-compare](https://app-compare.pages.dev/blog/shopify-payments-countries/)) | Setup and yearly costs (company secretary, audit); opening a bank account takes time |
| **US LLC** | US Stripe and Shopify Payments, US marketplaces | Foreign-owned single-member LLCs have yearly US filings (Form 5472). Doesn't remove your Chinese tax obligations ([good-vat guide](https://good-vat.pages.dev/guides/usa-sales-tax/foreign-seller-compliance-checklist)) |

**Practical path:** start testing with what you have (PayPal plus your Chinese entity). Register a
Hong Kong company once a product sells steadily and payment fees start to matter.

## 6.2 Product safety (US)

- **CPSC eFiling (since 8 Jul 2026):** importers of products covered by a CPSC safety rule, standard
  or ban must file certificate data electronically **before** goods enter the US
  ([CPSC](https://www.cpsc.gov/Newsroom/News-Releases/2026/CPSC-Implements-Mandatory-eFiling-for-Certificates-of-Compliance-Targeting-Dangerous-Foreign-Imports),
  [Akin Gump](https://www.akingump.com/en/insights/alerts/cpsc-rule-mandates-efiling-of-certificates-of-compliance-for-imported-consumer-products)).
  It doesn't change *which* products need a certificate, only that the data is filed at entry.
  Ask your shipping line or customs broker how they handle it.
- **Children's products** (anything designed for kids 12 and under) need third-party testing and a
  Children's Product Certificate. **Avoid kids' items** until you have a compliance partner.
- **Food contact** (e.g. silicone lick mats): ask for FDA 21 CFR 177.2600 test reports.
- **California Prop 65:** some materials need a warning for California shoppers. Ask suppliers for
  material composition.

## 6.3 Product safety (EU and UK)

- **EU GPSR:** every consumer product sold to EU shoppers needs an **EU-based responsible
  person**: an importer, an authorized representative, or an EU subsidiary. Their details go on
  the listing and the packaging, and marketplaces remove listings without them
  ([Freyr](https://www.freyrsolutions.com/blog/gpsr-authorized-representative-compliance-why-every-non-eu-business-selling-in-europe-should-act-now.md),
  [Complir](https://www.complir.io/guides/gpsr-regulation-guide)). Authorized-representative services
  charge a fee, so factor it in before selling in the EU.
- **Jewelry in the EU:** nickel release limits (REACH). Ask for test reports.

## 6.4 US import duties

**Status in November 2026** (from trade-compliance sources; check your product's code at
[hts.usitc.gov](https://hts.usitc.gov/) before pricing):

| Layer | Status | Source |
|---|---|---|
| Normal (MFN) duty | Depends on the HS code; often 0–7% for small consumer goods | USITC tariff schedule |
| 2018 China lists (Section 301) | Still in force: 7.5% or 25% on most listed products, higher on some | [EcoVadis](https://ecovadis.com/blog/section-301-china-tariffs/), [Portless](https://www.portless.com/blogs/section-301-tariffs-china) |
| **New 12.5% China duty (Section 301, forced labor)** | Since **24 Jul 2026**, flat 12.5% on Chinese-origin goods | [Portless](https://www.portless.com/blogs/section-301-tariffs-china), [Wanlong](https://www.wanlongintl.com/news/us-section-301-supreme-court-ieepa-feb-2026) |
| IEEPA "fentanyl" and "reciprocal" tariffs | **Ended.** Supreme Court ruling of 20 Feb 2026; collection stopped 24 Feb 2026 | [China Briefing](https://www.china-briefing.com/news/supreme-court-tariff-ruling-china-impact/) |
| Temporary 10% global surcharge (Section 122) | **Expired 24 Jul 2026** | [Ginger Control](https://gingercontrol.com/blog/section-122-tariffs-explained) |
| Duty-free under $800 | **Gone** for China/HK since 2 May 2025 (all countries since 29 Aug 2025); made permanent by regulation; full legal repeal due 1 Jul 2027 | [China Fulfillment](https://www.china-fulfillment.com/us-de-minimis-ended-2026-china-sellers-guide.html), [Tariffs Tool](https://www.tariffstool.com/guides/de-minimis-exemption-ended-2026) |
| Remaining China-list exclusions | 178 exclusions expire 9 Nov 2026 unless extended | [EcoVadis](https://ecovadis.com/blog/section-301-china-tariffs/) |

**Typical total for a consumer good:** normal duty + 0/7.5/25% (list status) + 12.5%, so roughly
**12.5% to 40%** of customs value. Customs value is the shopper's price for direct parcels, or your
purchase price for bulk imports. A September 2026 US–China summit agreed cuts on about $30 billion
of goods, with lists published 28 Sep 2026 but no rates or dates yet
([Tariffs Tool](https://www.tariffstool.com/guides/de-minimis-exemption-ended-2026)). Watch for
updates.

## 6.5 EU and UK import rules

- **EU:** since **1 Jul 2026**, small parcels (≤ €150) pay a temporary **€3 customs duty**, charged
  per item or per customs line depending on the source. It's due to run until mid-2028, when full
  duty applies ([DHL](https://www.dhl.com/discover/en-cz/logistics-advice/import-export-advice/eu-2026-duty-de-minimis-removal),
  [MHA](https://www.mha.co.uk/insights/customs-update-3-duty-on-low-value-e-commerce-imports),
  [Dutify](https://docs.dutify.com/docs/eu-de-minimis-removal-how-to-stay-compliant-2026)).
  Some countries add national fees (France €2 per item from Mar 2026; Romania about €5). An EU-wide
  €2 handling fee is also reported, with timing unconfirmed. VAT on parcels up to €150 is usually
  collected at checkout through **IOSS** registration, or by the marketplace.
- **UK:** VAT on goods up to £135 is collected at the point of sale by the seller or marketplace.
  The UK is reviewing its low-value import rules
  ([IF Global](https://www.ifglobal.com/resources/blog/the-end-of-de-minimis-in-the-eu-and-uk)), so
  check before launching there.

## 6.6 Getting paid

| Tool | Use | Notes |
|---|---|---|
| Shopify Payments | Card payments on your store | Needs a supported-country company (e.g. Hong Kong). US rate on Basic: 2.9% + $0.30 |
| PayPal | Card and PayPal payments | US schedule (Oct 2026): cards 2.99% + fixed; PayPal checkout 3.49% + fixed; **+1.50% international** ([PayPal](https://www.paypalobjects.com/marketing/ua/pdf/US/us-merchant-fees-01-october-2026.pdf)). Dropshippers report frozen funds, so don't rely on it alone ([CJ](https://cjdropshipping.com/blogs/dropshipping-knowledge/Best-Payment-Methods-for-Dropshipping-Businesses)) |
| Stripe (via an HK company) | Cards | HK local cards quoted about 3.4% + HK$2.35 (competitor comparison: [Airwallex](https://www.airwallex.com/en-hk/blog/ecommerce-payment-providers)) |
| Payoneer, LianLian, WorldFirst, PingPong, Airwallex | Receive USD/GBP/EUR payouts and convert to RMB | Payoneer and LianLian reportedly appear on the PBoC payment-institution register ([private.law](https://wiki.private.law/en/china-supplier-payouts)). Compare fees and conversion rates |

**Bringing money into China:**
- The **US$50,000-a-year** individual foreign-exchange quota is unchanged in 2026.
- New identity checks apply to cross-border remittances of **RMB 5,000 / US$1,000 or more** from 1
  Jan 2026 ([Webull/China news](https://www.webull.com/news/13974173100655616)).
- Documented cross-border ecommerce receipts **may** fall outside the individual quota with genuine
  transaction records ([Global Solo](https://www.globalsolo.global/blog/china-forex-quota-us-llc-guide-2026)),
  but this is a secondary source. Keep every order record and confirm with your bank or an FX
  adviser.

## 6.7 Sales tax and VAT

- **US sales tax:** foreign sellers fall under the same "economic nexus" rules as US sellers. Most
  states trigger at **$100,000** a year of sales into the state; California and New York use
  $500,000 (New York also needs 100+ transactions); Alabama $250,000
  ([Commenda](https://www.commenda.io/blog/economic-nexus-sales-tax),
  [Stripe](https://stripe.com/resources/more/sales-tax-nexus-laws)). In most states, marketplace
  sales (e.g. TikTok Shop, which collects tax on its own sales) count toward the threshold.
- **Practical:** a small store won't reach $100k in any one state at first, but switch on Shopify's
  sales-tax tracking from day one so you know when you do.
- **EU:** VAT through IOSS (see 6.5). **UK:** VAT on ≤ £135 collected at sale.

## 6.8 Advertising and consumer law

- **FTC Consumer Review Rule** (in force since 21 Oct 2024) bans:
  - fake reviews and testimonials, including AI-written ones
  - buying positive reviews
  - suppressing negative reviews
  - certain misleading review practices

  Penalties are up to about **$53,088 per violation** (2025 inflation-adjusted figure). The FTC sent
  its first warning letters in December 2025 and has since filed a federal complaint
  ([Crowell](https://crowell.com/en/insights/client-alerts/final-rule-announced-the-ftc-strengthens-its-enforcement-capacity-against-deceptive-reviews-and-testimonials),
  [Benesch](https://www.beneschlaw.com/insight/five-stars-zero-tolerance-ftc-turns-up-enforcement-under-consumer-review-rule/),
  [LexBlog](https://www.lexblog.com/2026/05/27/ftc-and-doj-continue-focus-on-consumer-reviews-rule-with-complaint-against-premium-home-service/)).
  **Never** post invented reviews, ask for reviews only if positive, or offer rewards for positive
  reviews.
- **Creator disclosure:** paid or gifted creator posts must be disclosed (FTC Endorsement Guides;
  TikTok's branded-content toggle).
- **Pricing claims:** only show a "was" price if you genuinely sold at that price. Bundle savings
  calculated from your real single price (as the pages do) are fine.
- **Urgency claims:** no fake countdown timers or "only 3 left" unless true.
- **Health and medical claims:** no "cures anxiety" or "pain relief" claims. Describe use, not
  medical outcomes.
- **Trademarks:** don't use other brands' names ("LickiMat-style", "Labubu dupe"). Search your own
  brand name in the [USPTO database](https://tmsearch.uspto.gov/) before investing in it.
- **TikTok ad review:** business documents must be genuine, and landing pages need local prices plus
  terms, shipping, privacy, returns and refund policies
  ([TikTok](https://ads.tiktok.com/help/article/tiktok-advertising-policies-ad-creatives-landing-page-ad-format-and-functionality?lang=en)).

## 6.9 Your tax in China

Income from overseas sales is generally taxable in China. Keep complete records: orders,
payouts, supplier invoices and shipping costs. Use an accountant familiar with cross-border
ecommerce (跨境电商) to choose between an individual business and a company structure.
