# Rockside Talent

Rockside represents models, actors and creators in Gibraltar, with opportunities beyond it. Serve two audiences: talent seeking representation and brands seeking people for projects.

## Approved visual system

Preserve the open, centred homepage, two-line headline, supporting copy and two low audience panels. Use the approved wordmark and small circular R, never recreate them with a font. Keep the headline “A small place. A world of talent.” No invented roster, clients, statistics, testimonials or photography.

Paper #f7f7f2, ink #20211f, lime #c9fa21. Pale lime #eaf6c0 is a supporting panel colour. Use the local Rockside display font for uppercase headings; Arial/Helvetica for body copy and controls. Lime marks the primary action. Reserve ample negative space. Do not add decorative glass, gradients, floating cards or bento grids.

## Responsive geometry

fluid.css is the geometry source: clamp-based viewport gutters and section spacing, container-relative heading sizes, readable rem limits, and a 112rem maximum shell. At 760px the navigation, audience routes and content columns adapt to a single column. Preserve reading order and every action. Use dynamic viewport height for full-screen views, safe-area padding and native overflow scrolling. Body text and form inputs stay at least 1rem. Controls stay at least 3rem high where possible. Test 320, 390, 768, 1440 and 2560px widths, plus short landscape viewports. Do not force the desktop composition onto phones.

## Motion language

Quiet, direct and controlled. Feedback begins on press; hover changes colour or border without moving the layout. Use cubic-bezier(.22,1,.36,1). State transitions use 160–240ms, content dissolves 85ms out and 200ms in, accordions 300ms, mobile navigation 300ms in and 220ms out. Full-screen enquiry travel is distance-scaled from 620ms opening / 420ms closing. Reduce remaining duration when reversing close to the destination.

app.js animateTo reads current presentation values before cancelling an existing animation. Never restart a retargeted transition from a hardcoded initial value. A cancelled transition must not run stale cleanup, hide a reopened view or steal focus. Enquiry enters and exits on the same vertical path. No bounce, elastic effects, staggered routine input, decorative loops, card hover lifts or animated hero on first paint. Animate transform/opacity; accordion height is the deliberate layout exception and must remain reversible.

Reduced motion uses immediate state changes and native scrolling without large travel. If the preference changes during motion, finish active transitions. Avoid adding a framework for effects the browser already handles.

## Interaction rules

Enquiry is a full-screen view. Keep Close visible, trap focus, make background content inert, retain native form labels and validation, restore focus and the previous scroll position. Browser Back closes and Forward reopens the view. Close and Escape work during entry. Never lock input until an animation ends. Preserve form drafts when closing and reopening. The form sends through the server-only Rockside contact endpoint. Show success only after the endpoint accepts the message. Keep drafts on failure and reuse the same request ID when retrying unchanged content.

Mobile navigation opens over the page without changing document height. The menu toggle remains available to reverse it immediately. Escape closes; Tab stays within the menu and its toggle. Restore page access on close and when resizing to desktop. Switching from menu to enquiry must not leave the background locked afterward.

Discipline tabs support Arrow keys, Home and End with roving tabindex. Selected feedback updates immediately; rapid selections coalesce to the last requested content. Reserve enough space that text changes do not move the following section. An enquiry must match the discipline currently displayed.

Accordions retain native details/summary keyboard semantics. Capture current height before retargeting. Opening one closes the previous item. Rapid clicks must end at the last requested state. Hidden content cannot receive focus.

## Verification before release

Check all target widths for horizontal overflow and text clipping. Test open → close mid-entry, close → reopen mid-exit, repeated menu toggles, rapid tabs, accordion reversals, Escape, focus loops, focus restoration, Back/Forward, form validation and local download. Check reduced-motion in a browser when the test environment supports preference emulation; report any verification limits. Retest after relevant changes. Keep keyboard and native scrolling behaviour intact.

## Prompt sources

Applied to the existing approved interface, not a request to redesign it:
- https://aiuxplayground.com/prompts/polish-ui-motion
- https://aiuxplayground.com/prompts/design-apple-style-ui
- https://aiuxplayground.com/prompts/responsive-design-strategy
- https://aiuxplayground.com/prompts/create-design-md

## Detail and completeness pass

Keep the roster-in-development note before the discipline controls, with a direct introduction action. Tab indicators are selection dots, not expand/collapse crosses. Service actions use visible descriptive labels. Tablet service cards and enquiry fields stack through 1024px so controls remain spacious. Keep the hero geometry, colour system and section rhythm intact.

Form labels remain stable: error messages and counts sit outside their label elements and are referenced with aria-describedby. On submit, focus a linked error summary; let the user jump to each invalid field. Clear individual errors when corrected, and avoid rebuilding identical alerts on each keystroke. Limit names to 120, email to 254, and briefs to 4,000 characters. Preserve drafts on close. Editing clears stale success feedback. Email content preserves Unicode and real line breaks. A sending message, recoverable failure and confirmed acceptance are distinct states.

Do not put a private recipient address or delivery credentials in browser assets. The live endpoint is rockside-contact in the existing mail-enabled Supabase project. Its fixed recipient and sender are private database settings readable only by the server role; its sending credential comes from the server environment. The public client only has a publishable application key. Show Sending while pending, prevent double submissions, and preserve the request ID for safe retries. See ../backend/CONTACT-DELIVERY.md.
