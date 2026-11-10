# Inflektion homepage: content architecture

Status: **approved 2026-11-10** (with the decisions in section 7). Scope is the homepage only. Other pages appear as inactive nav items.

## 1. Inputs

| Source | What it gave us |
|---|---|
| Round 1 copy (text only, extracted from `concepts/v1-minimal/index.html`) | The "as is" message set, proof and CTAs analysed below |
| inflektion.ai, /who-we-help, /pricing | Live positioning, nav, plan structure, pain points |
| Product design system (Figma, Partner Portal) | Inter; pink primary `#FC00AB` / `#D32691`; violet secondary `#6946F4` / `#391296` / `#F4F4FB`; Tailwind grays; chart hues green, indigo, blue, orange |
| Brief from the user | Brands are the buyer. Creators are recruited to enrich the discovery network. Book a demo is the primary conversion. White-label portal is the product model |

**Confirmed facts we can use:** client logos (Oura, Muse, Power Plate, PowerDot, Mara Labs, The DNA Company); five named testimonials; four awards; "up to 200%" conversion lift on personalised funnels; plans from $495/month plus performance revenue share, no long-term contract.

**Dropped:** "The #1 health and wellness platform…" (per brief).

## 2. Inventory of the current copy

| # | Section (as is) | Message | Proof | CTA |
|---|---|---|---|---|
| A | Hero | "Scale the Partnerships. Not the Work." Discover, connect, launch, personalise and retain partners in one place | "#1" claim (dropped) | See Inflektion in Action; I'm an affiliate |
| B | Logos + awards | Built for the brands shaping H&W | 6 logos, 4 awards | – |
| C | Category | H&W "isn't another vertical": trust, education, audience fit | 6 brand categories, 6 partner types (each listed twice) | – |
| D | Why brands | Less busywork, more revenue: automation, personalisation, ease of use | – | – |
| E | Personalised funnels | One page, tailored per audience (Generic, Biohackers, Mothers, Health Care Professionals) | +200% conversion lift | – |
| F | Platform | Discover → Connect → Launch → Grow | – | Explore the platform |
| G | Affiliates | More ways to earn, less work to promote | – | Join the Network |
| H | Results | "Built for real programs…" | 5 testimonials | – |
| I | Final CTA | "Make partnerships your most scalable growth channel" | – | Book a Demo |

## 3. Mapping to the visitor's questions

A brand-side partnerships or growth manager arrives with these questions, in this order:

| Visitor question | Answered by (as is) | Verdict |
|---|---|---|
| What is it? | A (verbs list), F | Partly. "Partnership platform" is clear, but the **white-label partner portal**, which is the core product model, is never named |
| Is it for me? | B, C | Yes. The H&W specialism is strong, but it sits third and its lists are repeated |
| Why now / why change? | – | **Missing.** The live site's pain points (hit-and-miss performance, not enough affiliates, too laborious, success resets monthly) don't appear |
| How does it work? | D, E, F | Answered three times. D and F overlap (automation = discover/launch); the hero verbs repeat F |
| Does it work? / Proof | B, E, H | Proof is split across three places, and the awards sit in a logo strip where nobody reads them |
| Objections | H (indirectly) | Not addressed head-on. Switching cost, partner experience, margin protection and price are all answered in the testimonials or on the pricing page, but nothing points to them |
| Action | A, I | Clear. But G (creator CTA) interrupts the brand story between platform and proof |

## 4. Findings

**Gaps**
1. **The white-label portal is invisible.** Brands buy a branded portal that their partners log into. The product screenshot (brand switcher, partner impersonation, commissions, marketing resources, payments) is that portal, yet the copy never says so.
2. **No problem or "why change" beat.** The page jumps from logos to category to features without naming the pain the buyer feels.
3. **Objections are unanswered**: switching from another platform, partner adoption, discount-code leakage, cost. We have real evidence for each: the Truly Free, Upgraded Formulas, Oura and Aires Tech quotes, and the pricing facts.
4. **No price signal.** "From $495/month + revenue share, no long-term contract" is public and lowers the bar to booking a demo.

**Redundancy**
5. Hero verbs, "Why brands" (D) and the platform steps (F) describe the same workflow three times.
6. Category lists are duplicated (marquee copies), and "Ease of use" overlaps the Affiliates section.
7. "Trusted by" appears twice: the logo strip and the results heading.

**Ordering**
8. The creator section (G) sits mid-story. It belongs after the brand case has closed, as a slim second path.
9. Awards are buried in the logo strip. They make the most sense **after** the visitor has seen the technology, where "Most Innovative Technology" is earned rather than asserted.
10. Five testimonials in a tabbed carousel hide four of them. Each one answers a different objection and should sit where that objection comes up.

**Style notes**
- Headings move from Title Case to sentence case for readability.
- The "01–06" section numbering is removed. Chapter markers appear only inside the sticky "how it works" sequence, where they mark place.

## 5. Proposed scrollytelling narrative

Ten beats, brand-first. **◆** marks a section with an abstract-UI visual (soft-UI panels built from the kit).

| # | Section | Job | Content (from approved facts) | Visual |
|---|---|---|---|---|
| 1 | **Hero** | Say what it is and who it's for in one screen | H1 "Scale the partnerships. Not the work." Sub: one platform to find, launch and grow influencer and affiliate partners, with a partner portal in your brand. CTA Book a demo; text link "I'm a creator or affiliate" | ◆ Partner portal in a brand theme, with a funnel card and a match card |
| 2 | **Logos** | Instant "brands like me use this" | 6 client logos, one line | – |
| 3 | **The problem, in wellness** | Recognition, why now, why a specialist | The four live-site pain points, framed by "wellness partnerships run on trust, education and audience fit". **Why now:** two third-party stats from /who-we-help: "Over 81% of brands have an affiliate program, but 51% spend less than 10% on this channel" and affiliate ROAS 12x against Google Ads 5.3x and Meta Ads 3.0x, each with a source note. One compact list of categories (supplements, fitness, health tech, functional foods, beauty, mental health) | Simple ROAS bar comparison (inline SVG) |
| 4 | **How it works** (sticky, 4 chapters) | One clear model of the product; replaces D and F | Discover → Connect → Launch → Grow. Each chapter has 1 heading, 1–2 sentences and a visual that changes as you scroll. Automation lines (forms, terms, codes, links) live in Launch | ◆ ×4 (partner match list, outreach thread, launch checklist, performance chart) |
| 5 | **Your brand, their portal** | Name the differentiator: white-label | The same portal shown in two brand themes. Partners get opportunities, assets, performance and earnings in one place. Inline quote: **Oura** (partner-friendly, fits custom stack) | ◆ Two themed portal panels |
| 6 | **Personalised funnels** | Show the upside | Audience switch (Generic, Biohackers, Mothers, Health Care Professionals); "Up to 200% higher conversion rates"; no designer, copywriter or developer per variation. Inline quote: **Truly Free Home** (personalised landing pages, commission tiering) | ◆ Interactive landing-page panel |
| 7 | **Recognition** (special treatment) | Third-party credibility, earned after the product story | 2025 Gold Winner, Most Innovative Technology (featured), plus three finalist awards (US Partnership Awards 2026, Best Platform 2025, Best Tech for Partnership Marketing 2024) | Award objects (treatment differs per concept) |
| 8 | **Switching and protection** | Handle objections with proof | **Upgraded Formulas** (switched from Refersion), **Aires Tech** (discount-code leakage), **Muse** (affiliate relationships) | – |
| 9 | **Creators and affiliates** | Secondary path; enriches the discovery network | More ways to earn, less work to promote; three benefits; Join the network | ◆ Small creator-side asset stack |
| 10 | **Final CTA** | Convert | "Make partnerships your most scalable growth channel." Book a demo. Price line: from $495/month + performance revenue share, no long-term contract (See pricing is inactive) | – |
| – | Footer | Wayfinding | Brand login, Affiliate login, inactive page links, legal | – |

**Nav:** logo · Who we help · Why Inflektion · Pricing (all inactive, marked "coming soon" for screen readers) · Log in · **Book a demo**.

**Awards placement rationale:** a single line in the hero area ("2025 Gold Winner, Most Innovative Technology") teases it. The full Recognition beat sits after the product story, so the award reads as confirmation.

## 6. Two directions

Both use the same narrative and copy, Inter, and the pink/violet brand anchors. They differ in how the story is told visually.

### v3: Portal views (soft-UI illustration-led)
References: Ramp for Startups, Cohere. Calm, light, editorial. Large soft-UI compositions of abstracted portal screens carry the story. They are built from a token-driven kit (panel, sidebar, stat tile, chart, list row, chip, avatar, button) in HTML/CSS, with inline SVG for charts and line work. Colour is mostly neutral with pink as the single action colour and violet for depth. The sticky "How it works" swaps the panel state per chapter.

### v4: Thematic, "The wellness shelf" (reworked and renamed "Lifestyle frame" after the first v4 review)
References: Gumroad's illustrated hard-offset shadows, the client mockup, Fluz's confident display type. The product is presented as if it were stocked on a wellness shelf: sections become **packaging and labels**. A "What's inside" ingredient-style panel lists the platform. Awards become seals on the pack. Pricing reads like a label line. It uses flat colour blocks from the brand palette, thick ink outlines and solid offset shadows, with simplified placeholder product panels in the same style.

Alternative themes if the shelf doesn't fit: **matchmaking** (brand and creator cards paired, tickets and stamps), or **training log** (program as a progress journal).

Overlap with round 1's colour blocking and sticker treatment is accepted for v4.

## 7. Decisions (resolved at sign-off)
- **v4 overlap** with round 1 v2's colour blocks and stickers is acceptable.
- **Third-party stats** go in the problem/why-now beat (section 3), where they earn the space. Used: 81%/51% channel underinvestment and the 12x / 5.3x / 3.0x ROAS comparison. Not used: MartechRecord's "42% planning to invest in 2024", which is stale for a 2026 page. Each stat shows a source note, and the original sources still need confirming before launch.
- **Agencies** stay off the homepage. Neither the live homepage nor the client mockup features them.
- **"Up to 200% higher conversion rates"** stays for now, open to iteration.
- **Future rounds:** the matchmaking theme (v5) and training log theme (v6) are parked and not built in this pass.
