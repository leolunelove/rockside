# Rockside interaction refinement — 26 November 2026

All four shortlisted prompts were applied to the approved interface. No new visual direction was introduced.

## Motion polish

Removed decorative card lifts, generic hover scaling, button icon spins and hover shadows. Kept quiet colour/border feedback and small immediate press feedback. Consolidated the easing family. Replaced abrupt menu, tab and accordion state changes. No first-paint choreography or infinite animation was added.

## Fluid interaction pass

The previous enquiry cancelled its opening and restarted its close at a fixed position, on a different exit path. It now reads live presentation values before cancelling, then moves toward the requested destination on the same vertical path. The duration scales with remaining travel. Cancelled operations cannot run stale completion cleanup. The same retargeting helper drives menu and accordion motion. This site has no drag gestures; momentum projection, rubber-banding and decorative glass were intentionally not added.

## Responsive pass

Preserved the approved fluid shell, typography and generous spacing. Tab copy is now measured across all three disciplines at its actual rendered width, including the loaded font, to reserve the maximum required space per field. It recalculates when the copy width changes. Mobile navigation is a fixed opening view, so it does not push page content down. A desktop resize closes it and restores background access. Full-screen enquiry uses dynamic viewport height, native scrolling and a sticky Close control.

## Design rules

DESIGN.md records real colour/type/spacing tokens, the approved layout, component rules, motion timings, responsive behaviour, keyboard expectations and verification requirements. Sources are linked there. Keep these rules with future website edits.

## Verification

- Native browser test: enquiry sampled at Y=574.913px during entry, then reversed with Escape. The first sampled reversal position was also Y=574.913px: no reset to an endpoint.
- Browser Forward reopened the enquiry after an interrupted close and reached Y=0 with heading focus.
- Rapid mobile menu toggles ended at the final requested state. Escape restored focus to the toggle and released the background. Tab loop and menu-to-enquiry handoff passed.
- Tab Arrow/Home keys and rapid selections passed. All disciplines produced identical panel heights at each tested width: 320px=775.375px, 390px=732.375px, 768px=468.375px, 1440px=429.359px, 2560px=544px. No horizontal overflow at any width.
- Repeated accordion keyboard activation settled to the requested state, without stale open items. Closing rows restored natural summary height.
- Enquiry Close restored scroll position exactly (2292px before and after) and returned focus to the originating button.
- 844×390 landscape test: full-screen view height matched the viewport, content remained scrollable, Close remained reachable, no horizontal overflow.
- Browser console contained no errors at final review. JavaScript syntax check passed.
- Four Node tests passed: reduced-motion bypass, presentation-value reversal, twelve rapid retargets with only the last commit, and reduced-motion enabled mid-transition.

Limits: browser verification used the available in-app browser, not physical iOS/Android devices or a cross-browser laboratory. Its API cannot emulate the OS reduced-motion preference, so that preference branch was tested with the automated fixture; the CSS media-query fallback was reviewed. No universal frame-rate claim is made. The enquiry still downloads locally and does not send email.

Run tests with `node --test tests/motion.test.cjs` from this directory.
