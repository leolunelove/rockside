# Rockside — focused audience views

## Purpose and direction
For models, actors and creators exploring representation, and brands planning a booking. Vanilla HTML/CSS/JavaScript. Direction: **confident talent editorial**. The memorable move is the oversized lime discipline index on ink. The centred hero, paper/ink/lime brand and custom display lettering remain deliberate brand constraints, not defaults selected by the prompts.

## A. Feel audit (implemented)
| Criterion | Score / 5 | Evidence / limit |
|---|---|---|
| Response | 4 | Native :active press treatment starts on pointer-down; no network or staged delay before opening. |
| Directness | 4 | Two explicit audience routes open their corresponding view. Native scroll; no drag gesture added to reading content. |
| Interruptibility | 5 | Full-screen spring retains position and velocity on retarget. Back/Forward can reverse travel; old completion cannot hide a reopened surface. |
| Spring behavior | 5 | Analytic critically damped integration; refresh-rate independent; no decorative bounce. Unit checks cover reversal, long frames and convergence. |
| Spatial consistency | 4 | Audience/contact surface enters upward and exits down the same path. Internal contact route keeps the surface in place; Back restores prior scroll and trigger focus. |
| Materials | 4 | Solid readable content, lightly translucent sticky toolbar; no stacked glass or decorative shadows. |
| Reduced motion | 5 | Travel settles instantly; in-flight spring completes immediately when preference changes. Existing quiet content dissolves also resolve instantly. |

## B. Critique addressed
- Hierarchy: long audience sections competed with the hero; moved into dedicated full-screen views.
- Scan path: booking process belonged beside services; moved into the brand view.
- Typography: custom condensed lettering stays the personality face; quiet body sans stays supporting.
- Colour: retained approved palette; dark view now has a clear audience purpose.
- Spacing: retained reading room while reducing homepage length.
- Chrome: removed ordinal numbers from disciplines and services because they encode no sequence.
- Surfaces: audience route panels have a consistent restrained radius; content uses open layouts.
- Motion: replaced fixed-duration overlay travel with a retargetable spring.
- Copy: explicit audience labels and contextual representation/booking form defaults.
- Accessibility: one dialog, background inert, visible close/back, keyboard trapping, history and focus restoration.

## C. Primary path
1. Pointer-down produces native press feedback; click/keyboard activation pushes #talent or #brands.
2. The full-screen surface becomes available immediately. Background becomes inert; heading receives focus.
3. Position travels 100% → 0%. All content remains natively scrollable.
4. A service/introduction action changes the same surface to contact; no second overlay. A 160ms opacity .6 → 1 dissolve confirms content replacement.
5. Back returns to the audience view, its previous scroll and activating control. Close returns home and restores the original route control and home scroll.
6. Escape follows the same navigation. Browser Forward reopens the corresponding route. Direct #talent/#brands links open the appropriate view.

Interrupt/reverse: retarget spring at its current position and velocity; never reset to an endpoint or await old travel. Each completion has a version guard. Input is not blocked during travel. Buttons remain real buttons/links.
Edges: no custom drag or rubber-band layer. Native browser scrolling owns the edge behavior; overscroll containment prevents background scrolling. Momentum projection/grab offsets are inapplicable because these are activated views, not draggable sheets.
Reduced motion: instant positional changes and content replacement; no scale, travel or bounce required to understand the state.

## D. Motion parameters
- Full-screen translate3d Y: 100% ↔ 0%; mass 1, stiffness 400, damping 40, damping ratio 1, angular frequency 20 rad/s. Main movement ~0.3–0.4s, precision settle ~0.6s. No bounce allowed for these click-driven views.
- Analytic update uses elapsed seconds, preserving velocity through reversal; no numerical explosion on a long frame.
- Stop at positional error <.025 percentage points and velocity <.1 percentage points/s; commit exact target and stop RAF.
- Hover/press: CSS transitions 60–160ms, no hover lift. No keyframes on full-screen travel or press states.
- Tabs: immediate selected state, coalesced 85ms fade to .12 then 200ms return to 1; reserved copy heights.
- Accordion: reversible measured height, 300ms; intentional exception to transform-only because following content must track its layout.
- Mobile navigation: existing 12px/opacity reversible opening; native click controls. No decorative entrance or idle loops.

## E. Materials and implementation checklist
- [x] Solid paper #f7f7f2 or ink #20211f content; lime #c9fa21 identifies selection/action.
- [x] Toolbar uses matching 96% opaque material with 12px backdrop blur; solid under reduced motion. No scrim: full-screen surface covers background. No shadow needed at full-screen size.
- [x] One modal semantic surface, dynamic accessible label, hidden inactive sections.
- [x] Focus restoration after native hash navigation and spring completion; visible close/back always present.
- [x] Preserve form draft when navigating away/back. Delivery endpoint and private recipient unchanged.
- [x] Keep native links with real fragment URLs; intercept their activation to open the audience view.
- [x] Keep native pointer activation/active styles. Do not install Pointer Events capture or recognizers where there is no drag interaction.
- [x] Test 320, 390, 768 and 1440px, mobile menu → brands, audience → form → Back, focus/scroll restoration, rapid tab and accordion changes, mid-close Forward reversal.
- [x] Test reduced motion, retarget cancellation and refresh-rate independence in automated fixtures.
- [NEEDS INPUT] Real roster and approved portfolio material, before adding talent profiles or work imagery.

## F. Do / Don't
Do: keep the hero still; use audience routes consistently across navigation; preserve drafts; restore prior reading position; keep keyboard focus inside the active view.
Don't: stack contact over a second dialog; add swipe-to-dismiss over form fields; bounce a click-opened view; invent roster imagery or client proof; replace the approved brand with generic glass or new colours.

## Self-check
The aesthetic risk is a large ink talent index inside a focused full-screen view. Decorative numbering removed. Body text uses high-contrast paper/ink or #c3c6ba on ink (4.5:1 intent exceeded). Complexity is limited to routing and one physical transition. No new brand facts claimed.
