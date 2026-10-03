# EBM Event & Event Registration Pages — UI/UX Audit

- **Date:** 2026-09-30 · **Target:** production site, EBM (promoted management) account
- **Method:** Playwright (Chromium), desktop 1440×900 + mobile 390×844, read-only walkthrough: login → member dashboard → profile “Switch Dashboard” → EBM dashboard → My Events → Event Registrations (list + detail) → Create Event. Search/filter exercised. No approvals, payments, publishing, or deletions were performed. Logged out at the end.
- **Scope:** EBM event + event registration flows only. Approve/reject, publish, export-download and dark-mode paths were observed but not executed.
- **Follow-up (same day):** findings F1–F8, F10, F13 (regs side) and F20 were fixed in frontend (verified on a TiDB-preview-backed scratch stack, then cleaned up); F1 also needed a 3-line backend fix (see “Fixes applied”). F4 was corrected on re-test (see below).
- **Follow-up (2026-10-03):** Event Registrations page fully redesigned against the 13-section UX spec — F7 (status/payment merge), native table sorting, resizable two-pane workspace, two-step approval/reject, export disclosure, surfaced error states (see “Event Registrations — redesign pass”).
- **Refinement pass (2026-10-03, same day):** screenshot-verified against `public/inspirations/data-dashboard` (EvenTum order page). Root cause found for runaway page scroll — `lg:h-[calc(100vh-80px)]` is invalid CSS (calc needs spaces, browser dropped it); page now measures available height at runtime so the toolbar stays pinned and each pane scrolls internally (doc overflow 9543px → 77px residual from AppLayout's own `min-h-screen`, same as every other page). Rail defaults to 320px (measured), side-by-side only from xl, sort icons inline, tinted thead, `table-fixed` + explicit column widths, hugging status pills, stacked big-numeral stats. tsc/lint/build clean, `impeccable detect` 0 findings, verified at 1440/1180/820/390 + modals + light mode with zero console errors.
- **Feedback round (2026-10-03):** table status cell is now badge-free dot + label with payment beneath (no UTR in table; full UTR shown by default in the review modal, Reveal toggle removed); bigger eye icons; all filter popovers forced opaque; stats became a dot + divider segmented strip (2×2 grid on mobile); added Branch and Year filters (options from data, display-cased, synced to `?branch=`/`?year=`); review modal uses hierarchy cards (tinted identity card + Registration/Payment/Attendee cards); drag-resize no longer re-renders per mousemove (rAF direct CSS-var updates, state committed on release). Verified via screenshots incl. open dropdowns, filtered states, drag commit, and mobile; tsc/lint/build clean, detector 0 findings.
- **Feedback round 2 (2026-10-03):** all status dots replaced with glyphs (CheckCircle2/Clock/PauseCircle/Ban/XCircle via a shared icon map — table, badges, rail pills, modal payment line); Cancelled is now neutral zinc (Ban) while Rejected stays red (XCircle) so the two can never be confused; Review buttons are icon-only with tooltip again (ACTIONS narrowed to 72px); UTR gets an amber highlight block with Copy button in the review modal (full value by default); modal inner styles reverted to the original apart from card backgrounds; stats use tinted icon chips in place of dots. Verified incl. `?status=cancelled` rows; tsc/lint/build clean, detector 0 findings.
- **Dialog rebuild (2026-10-03, per reference screenshot):** review dialog now mirrors the reference — "Registration Review" title + registration UUID subtitle, solid mint text-only status chip, amber UTR hero (card icon + label + big number + helper inside + Copy), three mini-cards (Payment status / Registered / Ticket code), cyan ATTENDEE heading with icon + label + value rows over hairlines, full-width Close footer. Inner styles otherwise preserved; dark-mode adaptation included. Verified light + dark with zero console errors; tsc/lint/build clean, detector 0 findings.
- **Dark-theme background fix (2026-10-03):** the workspace rendered as a near-black slab (`zinc-950`) against the navy shell (`gray-900`). Re-based the surface stack on `zinc-900` for the workspace container and re-tuned every dependent surface: solid `zinc-800` sticky thead (also fixes light-mode text bleed from the old translucent header), `zinc-800/60` row/rail hovers, `zinc-950` select popovers and mini/mobile cards for proper float depth, black tooltips. Verified at desktop/tablet/mobile with zero console errors; tsc/lint/build clean, detector 0 findings.
- **Surface color (2026-10-03, user pick):** workspace container now uses `#101828` in dark mode — seamless with the navy shell, panel still defined by its border; controls/thead/dividers verified readable on it. tsc/lint/build clean.
- **Surface sync (2026-10-03, user pick):** replaced `zinc-800`/`zinc-700` (`#27272A` family) with `slate-800`/`slate-700` across all dark surfaces, borders, and hovers (51 spots) so fills sync with the navy `#101828` background; text ramp and light theme untouched. Verified desktop + modal; tsc/lint/build clean.

## What is already working

- Profile **Switch Dashboard** (Management ⇄ Executive Body Member) works smoothly with a clear checked state.
- Registration detail has a good status summary (Total / Confirmed / Pending / Cancelled), working name/reg-no./UTR search (verified live: full list narrows correctly) and a status filter, plus Export/Refresh actions.
- Empty states exist (“Select an event to view registrations”) and no console/API errors appeared during the walkthrough.
- Logout is guarded by a confirm dialog and clears the session token.
- Consistent app shell (sidebar + header + cards) across all EBM pages.

## Findings

| # | Severity | Page | Finding | Recommendation |
|---|----------|------|---------|----------------|
| F1 | High | My Events | Stats column shows **“0 Regs”** for an event that has 130+ registrations on the Registrations page. The two pages contradict each other. | Fix the count source (or label what it counts). A wrong zero destroys trust in the whole dashboard. |
| F2 | High | Event Registrations | At 1440px the table **overflows horizontally** — the rightmost column is cut off and must be scrolled to. | Reduce columns (merge Payment into Status), tighten padding, or pin the table in a scroll container with a visible affordance. |
| F3 | High | Mobile (390px) | Both tables overflow with **columns cut off** and no card/stack fallback. EBMs checking entries at a venue gate are likely on phones. | Render a stacked card layout under ~640px (attendee → reg no → status → UTR), or at minimum freeze the first column with a scroll hint. |
| F4 | ~~High~~ Medium (corrected) | Event Registrations | Re-test showed each row **does** open a full review flow via the Eye action button (UTR prominent + Approve/Cancel with confirm step) — the earlier “row click does nothing” only meant the row body itself isn’t clickable. Residual issues: icon-only ~32px button is small and easy to miss. **Fixed:** review/modal action buttons enlarged to 48px; mobile cards get a full-width 48px “Review Registration” button. Row-body click still intentionally inert. |
| F5 | Medium | Event Registrations | Event must be **manually selected** even when the EBM owns exactly one event. | Auto-select when there is only one event. |
| F6 | Medium | Event Registrations | Selection is state-only — the **URL never changes**, so the view can’t be refreshed, bookmarked, or shared with a co-organizer. | Sync selected event to the URL (`…/event-registrations/:uuid`, a route that already exists). |
| F7 | Medium | Event Registrations | Two badges per row say nearly the same thing: green **Confirmed** (registration) + blue **Success** (payment). The taxonomy is confusing — and it’s unclear what “Cancelled” means for money already collected. | One status column with a single vocabulary (e.g. Confirmed / Pending / Cancelled), payment shown as sub-text. |
| F8 | Medium | Event Registrations | Full **UTR numbers are displayed** in plain text for every attendee to every EBM viewer. | Mask middle digits (`XXXX…1234`) with click-to-reveal; full value only in the detail view / export. |
| F9 | Medium | My Events | Badge styles are inconsistent: Type is a cyan pill (**Public**), Status is plain gray text (**Completed**). | One badge system for both; status should carry meaning (color + label), not gray text. |
| F10 | Medium | My Events | Row action icons (calendar, people) have **no labels or tooltips**. | Add `title`/aria-labels at minimum; labeled buttons are better. |
| F11 | Medium | EBM Dashboard | Title says **“Executive Dashboard”** while the sidebar says **“EBM Dashboard.”** | Pick one name everywhere. |
| F12 | Medium | Member dashboard | Greeting renders the raw member ID (**“Hi, ‹member-ID›”**) instead of the person’s name, and the role chip shows a raw enum (**“Executive Body_member”** with underscore). | Greet by first name; humanize role labels (“Executive Body Member”). |
| F13 | Medium | Member dashboard | “Profile Status” card shows a raw lowercase string (**“admin approved”**) in an awkward stacked layout; email is truncated with no tooltip. | Format status as a proper badge (“Approved”); add `title` on truncated email. |
| F14 | Medium | Create Event | **“Reg. Deadline”** label is red while every other label is black — red reads as “error.” Required-field marking is inconsistent across the form. | Use asterisks for required fields; reserve red for validation errors. |
| F15 | Medium | Create Event | **Discard** sits next to Publish with no visible guard, and there is **no draft save** — one misclick can wipe a long form. | Confirm dialog on Discard (verify), plus draft autosave/local persistence. |
| F16 | Low | Create Event | Category defaults to placeholder (“Select type”) but Mode defaults to “Online” — inconsistent defaulting. | Default both to placeholders, or preselect the most common real values. |
| F17 | Low | Member dashboard | Decorative quote banner (“Life is like a beautiful melody…”) pushes real stats below the fold; zero-state cards (0 LP, empty chart with “~ 0%”) dominate. | Replace quote with an onboarding checklist for new/zero-state users (complete profile → register → earn credits). |
| F18 | Low | EBM shell | Core EBM pages (Event Registrations, My Events, Create Event) hide inside a **collapsed “Events” submenu** — one extra click every visit, easy to miss. | Keep frequently used sections expanded for EBM role, or promote to top-level items. |
| F19 | Low | EBM shell | Collapsing the sidebar hides labels **and the Logout button** with no visible tooltips in the captured state. | Keep icon + tooltip on collapse; keep Logout reachable. |
| F20 | Low | Pagination | “Per Page / 1–1 of 1” chrome renders for a single-row table. | Hide pagination when everything fits on one page. |

## Fixes applied (same day, verified)

**My Events** (`src/pages/ExecutiveBodyMember/Events/MyEvents.tsx`)
- F1: `registrations_count` was never sent by `GET /ebm/my-events` (frontend fell back to `0`). Backend micro-fix only: `Event::registrations()` HasMany relation + `->withCount('registrations')` in `myEvents` — no migration, no route/auth changes. ⚠️ The `lolo_app` docker container still runs the old code; restart/rebuild it to pick this up.
- Fee display `$59` → `₹59`.
- Status badge unified with the Type pill system (was plain gray text).
- Restored the commented-out “View Registrations” action → deep-links to `…/event-registrations?event=<uuid>`; both action buttons are now 44px targets with aria-labels.
- Mobile (<768px) renders stacked event cards instead of a horizontally scrolling table; Details/Registrations buttons are 48px.
- Empty state gained a 48px “Create Event” CTA; Refresh is 44px and full-width on mobile.
- Floating pagination now only renders when there is more than one page (F20).

**Event Registrations** (`src/pages/ExecutiveBodyMember/EventRegistrations/EventRegistrationsPage.tsx`)
- F5/F6: selection syncs to `?event=<uuid>` (refresh-safe, shareable, back-button friendly); auto-selects when the EBM has exactly one event.
- F8: UTRs masked in the table (`•••• •••• 1234`, hover reveals); full UTR remains in the review modal where verification happens.
- Mobile (<768px) renders registration cards with a full-width 48px “Review Registration” button; desktop table unchanged.
- Touch targets: event-list rows 60px, pagination buttons 44px, Export/Refresh 40px, modal Close/Cancel/Approve 48px, modal ✕ 36px, sort headers 40px.

Verification: `tsc --noEmit` clean, `npm run build` green (29s), Playwright re-test on a scratch stack (vite :5174 → artisan :8001 → TiDB preview) covered deep-link select, masked table, review modal, mobile cards (Review button measured 282×48), empty-state CTA, and full-width mobile Refresh (374×44). All temp preview rows and the temp audit user were deleted afterwards (0 leftovers); scratch servers stopped; the regular local stack (:5173/:8000) untouched.

**Event Registrations — redesign pass (Oct 2026)** (`EventRegistrationsPage.tsx`, full rewrite; API contracts, endpoints, URL params and status vocabulary unchanged)
- F7: payment status folded into the Status column as a sub-line (`Confirmed · Paid`) instead of a second competing badge; table columns are now ATTENDEE / REG NO. / STATUS / REGISTERED / ACTIONS with native HeroUI sorting (`aria-sort`, keyboard-operable headers, custom chevron icon).
- Compact page header + single bordered workspace (events rail ⇄ resize separator ⇄ registration console); separator is keyboard-accessible (`role="separator"`, arrows/Shift/Home) and drags with pointer capture.
- Events rail: debounced search (300ms, `keepPreviousData` + opacity feedback), total-count chip, out-of-range `?epage` clamped, pagination hidden when `totalPages <= 1` (F20), distinct error vs empty states, width-reset button.
- Toolbar in three tiers: event info + Refresh/Export, stat items + "Showing X of Y" (`aria-live`) when filtered, search + status filter.
- Review modal: identity → Registration / Payment / Attendee sections, UTR reveal toggle (`aria-pressed`), processed-state note, two-step confirmation labeled **Confirm Approval / Confirm Rejection** with duplicate-submit guard; export asks for confirmation and discloses that full UTRs leave the app.
- Errors now surface via query `isError` → Retry panes (no swallowed catches); all icon-only controls carry `aria-label`s.
- Verification: `tsc --noEmit` clean, `npm run lint` clean for this file, `npm run build` green (16.7s), `impeccable detect` reports 0 anti-patterns for this file (3 remaining findings are in the unused legacy `ShowUTREventRegistrations.tsx`).
- Dropped deliberately: `payment_status` column sort (no longer a separate column).

## Remaining work (not yet fixed)

- F7 is fixed on the registrations page; F9–F13 label polish, F14–F16 create-event form guards, F17 zero-state onboarding, F18 sidebar IA, F19 collapsed-sidebar logout remain.
- Suggested order now: F12/F13/F9/F11 label pass → F15 Discard guard + drafts → F17 onboarding → F18/F19 nav.
- Legacy `ShowUTREventRegistrations.tsx` is unused (route commented out) but still carries 3 `impeccable detect` anti-patterns — delete or fix when touched.

## Limits of this audit

- Approval, publish, export-download, and dark-mode rendering were not exercised (read-only pass).
- Findings F1 (count mismatch) and F15 (Discard guard) need code-side confirmation; everything else is screenshot-evidenced from the live walkthrough.
- Screenshots contain account PII and are intentionally **not** committed — evidence available on request.
