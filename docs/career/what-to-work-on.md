# What to work on — job search

## Target role

**My ideal role is Forward Deployed Engineer (FDE)**, at any kind of company, not just AI companies. That's an engineer who embeds with customers, figures out the real problem, connects to their messy existing systems, ships, and gets people using it.

**Reality check:** many FDE postings ask for a few years of experience and a degree. Treat FDE as the long-term goal, and apply widely to roles that build the same skills (see "Roles to apply to" below). Everything in this doc helps for all of them.

Goal: a job lined up by Dec 2027 graduation; start applying around Aug 2027. Time budget: under 5 hours a week, so start with the ★ items.

Related: `portfolio/build-guide.md`, `portfolio/design-spec.md`, `resume/Sam_Mishin_Resume.md`

---

## Where I actually stand on requirements

- **Degree:** B.S. Computer Science (WGU) finishes Dec 2027, before most applications would start. Until then, list it as "expected Dec 2027"; it's normal and accepted.
- **Experience:** by Aug 2027 that's about 1 year as Marketing & Technology Lead (building production systems), plus freelance development since Oct 2023, plus the operations background. Count and describe it as real engineering experience, because it is.
- **Postings are wish lists.** Apply when you meet most of a posting, especially the parts about working with customers, which most new grads can't show.
- **Where the gap is real:** big-company FDE roles that ask for 3–5+ years. Those are a 2–3 year target, not a 2027 target.

---

## Roles to apply to (in order of fit)

1. **FDE / forward-deployed software engineer roles that take new grads or 0–2 years.** Some companies hire early-career FDEs; apply to every one you find.
2. **Customer-facing engineering roles with the same skills, under other titles:** solutions engineer, implementation engineer, integration engineer, customer engineer, deployment engineer, technical onboarding. These are the most common route into FDE.
3. **Full-stack engineer at small or growing startups**, where engineers talk to customers directly.
4. **Niche fit: wine, hospitality, restaurant and point-of-sale software companies.** The winery background plus Clover integration experience is rare.

After 1–2 years in any of these, FDE roles that ask for experience are realistic.

---

## Why FDE fits

The 14 Acres job is already FDE work with one customer:

- **Embedded with the business:** works on site, talks directly with the owner, GM and staff.
- **Messy existing systems:** Clover POS, Twilio, OwnerRez, Webflow, Make.com, a discontinued billing vendor.
- **Ships fast and owns it:** spend tracker, cash drawer app, inventory app, TV display, AI receptionist, Trellis.
- **Adoption:** trains staff on each system; 8–10 staff use the cash drawer app daily.
- **AI in production:** the receptionist answers about 50 calls a day.
- **Started at the bottom of the business** (dishwasher → vineyard manager → tech lead), so he understands the operation, not just the software.

The gap is **proof**: measured results, written-up process, a second customer, and showing he can explain things to non-technical people.

---

## New projects that show FDE skills

Ranked by FDE value for the time.

1. ★ **AI receptionist evals.** Pull a few weeks of call transcripts, sort them by outcome (correct / transferred / wrong), fix the top failure in the prompt, and measure again. Goal: a "cut wrong answers from X% to Y%" result. This doubles as the call-analytics portfolio project.
2. ★ **Trellis member migration write-up.** Moving about 800 members off a discontinued vendor into Trellis is classic FDE work: data migration, validation, cutover plan, rollback plan, communicating with staff and members. Document it as it happens (first live charges Jan 2027).
3. **Clover API client + MCP server.** Ship the open-source Clover client (built on 14 Acres time so Trellis can use it), then add an MCP server so an AI assistant can look up orders and customers. Shows integration and agent work.
4. **Second customer.** Either onboard a second winery to Trellis (the strongest FDE story), or deploy one 14 Acres system for a freelance client (e.g. lead follow-up or a dashboard for Royal Service Cleaning). Record how long setup took the second time.
5. **A "built in 48 hours" prototype.** Pick a real request from staff, ship a working version in a weekend, and write down what you cut to get there.
6. **Optional AI project: staff Q&A assistant** over the winery's procedures and policies, with a small eval set of real staff questions. Only if items 1–3 are done.

---

## Improve existing projects

**Applies to every project**

- [ ] ★ **Public demo with fake data.** Most of the work is private, so recruiters can't see it. Make a public demo of 1–2 systems (the cash drawer app is the easiest) with seeded fake data and a "demo" banner. Clicking around a working app beats any screenshot.
- [ ] ★ **A good README for every public repo:** one-line purpose, screenshot or GIF, architecture diagram, how to run it, tests, what you'd do next. Pin the best 4–6 repos on GitHub.
- [ ] **Before/after numbers for each system:** time saved, errors removed, users. Ask staff if you don't have the "before" number.
- [ ] **CI on every public repo** (lint + tests in GitHub Actions) with a status badge.

**Per project**

- **Trellis:** monitoring and alerts for failed charges, an admin audit log (who changed what), a short runbook for when billing fails, and a member self-service page once the MVP is stable. These show production thinking, not just features.
- **Customer spend tracker + identity matcher:** measure the matcher on a hand-labeled sample of real duplicates (how many it catches vs. how many it wrongly merges) and publish those numbers. Package the matcher as a small open-source library with its Vitest tests.
- **Cash drawer app:** a simple report of mismatches over time and how many counts were done in-app vs. on paper (proof of adoption). Best candidate for the public demo.
- **AI receptionist:** the evals project above, plus a short write-up of how event info stays current.
- **Chess Variant (hand-written):** finish WebSocket multiplayer, deploy it with a public link, add tests for the move rules. A playable link is the best hand-written proof.
- **Crypto Telegram bot (2022):** add a proper README and a short demo GIF, or move it off the front page once newer hand-written work exists.
- **Freelance client sites:** for 2–3 of the best, collect Lighthouse scores and any business result (leads, bookings) with the client's OK. Royal Service Cleaning's lead follow-up is a good one to measure.

---

## Portfolio structure for FDE

Keep the Windows Terminal design; change how the content is framed.

**Home page**

- **Headline:** something like "I embed with businesses and ship the software they run on."
- **Rename "Selected work" to "Deployments."** Each card shows customer · problem · what shipped · result · time to ship · number of users.
- **Impact strip** stays: orders synced, members, calls a day, staff using it, client sites.
- **New "How I work" section or page:** Listen → Prototype in days → Ship → Train → Measure → Improve. Each step links to a real artifact (a discovery note, a rollout plan, training notes, a write-up).
- **Quotes** from the owner or GM, real and with permission.

**Case-study template (every project)**

1. **Customer and context:** who they are, how they work, who uses the system
2. **Discovery:** what they asked for vs. what the real problem was
3. **Constraints:** existing systems, budget, staff comfort with tech, timeline
4. **What I shipped:** architecture diagram, key decisions
5. **Rollout and training:** how it went live, how staff learned it
6. **Results:** adoption and numbers
7. **What broke and what I changed:** be honest; FDE managers value this most
8. **What's next**

**Writing ("Field notes")**

Short write-ups of real problems, with private details removed. Start with:

- the duplicate-Clover-customer problem and the webhook redesign
- the Trellis migration
- receptionist evals: what the AI got wrong and how it was fixed

**Video**

A 2-minute walkthrough per major deployment, explained as if to an owner, not an engineer.

---

## Résumé structure for FDE

Keep the real job titles and one page. Change the framing:

1. **Header:** name, contact, LinkedIn, GitHub, portfolio link.
2. **Summary (2 lines), customer-first.** For example: "Full-stack engineer who embeds with businesses and ships the software they run on: POS integrations, a billing platform, and an AI phone receptionist answering about 50 calls a day at a working winery, plus about 12 client websites."
3. **Experience: 14 Acres first.** Write every bullet as **problem → what I shipped → result**, leading with the business problem. Put the customer-facing work up front:
   - gathered requirements from the owner and GM
   - trained 8–10 staff
   - supports and maintains live systems
   - integrated Clover, Twilio and OwnerRez
4. **Freelance as "client deployments":** each client is a separate customer, which shows repeated deployments. Name the systems you connected to, not just "built a website."
5. **Projects:** 2–3 only, ideally the receptionist evals, the Clover client / MCP server, and one hand-written project (chess variant or Telegram bot).
6. **Skills:** add a "Customer work" line: requirements gathering, scoping, staff training, technical writing, demos. Put AI skills (prompting, evals, MCP/agents) on their own line once the projects exist.
7. **Education and certifications** at the bottom, with the degree as "expected Dec 2027".

---

## Interview prep for FDE

- [ ] **Business-scenario practice**, out loud, alongside LeetCode. For example: "a hospital wants fewer no-shows — what do you build?" Ask questions first, break the problem down, scope a first version, say how you'd measure it. Use winery stories as examples.
- [ ] **Have 4–5 stories ready:** a time the customer asked for the wrong thing, a time something broke in production, a time you shipped fast by cutting scope, a time you trained reluctant users, a time you said no.
- [ ] **Explain-it-simply practice:** record yourself explaining idempotency keys or row-level security to a non-technical owner in under a minute.

---

## Portfolio polish — design + developer appeal

- [ ] ★ **Page transitions** with the View Transitions API: the project card or terminal card animates into the case study.
- [ ] ★ **Typography details:** `tabular-nums` on the impact numbers, `text-wrap: balance` on headings, real curly quotes and dashes.
- [ ] ★ **One interactive demo in a case study:** either a "Charge member" button on the Trellis page whose second click is blocked (explains idempotency keys), or a before/after slider on the cash drawer page (paper sheet vs. the app).
- [ ] **On-brand keyboard focus outline** (terminal-style, accent color).
- [ ] **"Copied to clipboard" terminal message** when clicking the email.
- [ ] **Short looping videos** (5–10s, MP4) of real use instead of still screenshots.
- [ ] **"How this site was built" page:** colors, fonts, Lighthouse scores, page weight, hand-written.

---

## Skill gaps

- [ ] OAuth and webhooks
- [ ] Docker
- [ ] Basic logging and monitoring
- [ ] Python data work (pandas)
- [ ] LLM evals and MCP/agents (covered by projects 1 and 3)

---

## Suggested order

1. Receptionist evals (FDE + AI story + case study in one)
2. Start the Trellis migration write-up now; finish it after the January 2027 go-live
3. READMEs for public repos + public demo of the cash drawer app with fake data
4. Duplicate-customer / webhook field note, with matcher accuracy numbers
5. Update the résumé to the FDE structure above
6. Build the portfolio (milestones in the build guide) with the "Deployments" framing and ★ polish items
7. Finish and deploy the chess variant's multiplayer (hand-written proof)
8. Clover API client → MCP server
9. Second customer (second winery on Trellis, or a freelance client)
10. Demo videos, then a meetup talk
11. From ~Aug 2027: apply to FDE, solutions/implementation engineer, startup full-stack, and hospitality/POS software roles; scenario interview practice alongside LeetCode
