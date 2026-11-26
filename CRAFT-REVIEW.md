# Rockside craft pass — 26 November 2026

Guidance used:
- Add taste to my design: https://aiuxplayground.com/prompts/add-taste-to-my-design
- Unslop my UI: https://aiuxplayground.com/prompts/unslop-my-ui
- Visual states pass: https://aiuxplayground.com/prompts/figma-make-visual-states (adapted from Make to the existing vanilla site)

Direction remains confident talent editorial. Variance 5/10, motion 2/10, density 3/10. Preserve the approved hero, custom display type, warm paper, ink and lime. No new decorative effects or imagery.

Changes:
- Added a persistent audience switch in full-screen headers, with pressed state and native history. Active audience does not push a duplicate route.
- On phones, discipline controls become a compact horizontal row. The content now starts much earlier; ARIA orientation updates at the same breakpoint.
- Back uses a left arrow; Close uses a cross. Text remains explicit.
- Direct-link close has a meaningful home control to restore focus to.
- Keyboard focus uses lime on ink and dark olive on paper. Programmatically focused view headings do not acquire browser-default blue boxes.
- Internal content transitions no longer reset opacity while an existing transition is running.
- Refined service title tracking and full-screen scrollbar stability.

Verification: 22 automated motion/contact/spring tests passed. Browser checked 320, 390, 768 and 1440px. No horizontal overflow in audience/contact views. Verified audience switching, selected states, contextual casting form, Back return, responsive tab orientation and keyboard focus colour. No console errors. No email delivery configuration changes or test emails.
