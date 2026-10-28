# Metameta Children's Home website

This is a static HTML, CSS, and JavaScript website. Netlify serves the project from its root; there is no frontend build step. The `functions/` directory contains separate Firebase Cloud Functions and is not deployed by Netlify.

## Shared navigation and theme

`theme.js` normalizes the public navigation links, highlights the current page, and adds the same theme control wherever a site navbar exists. The light/dark selection is saved in browser local storage and applies across page navigation. Shared navbar layout and theme colors are in `styles.css`.

## Run locally

Open `index.html` in a browser for basic page review. For a local HTTP server, run `npx serve .` from the project root (Node/npm required), then open the local URL printed by the command. Firebase-backed features require the configured Firebase project and network access.

## Netlify deployment

Connect the repository to Netlify and use the included `netlify.toml`. Set the build command to blank and publish directory to `.` (root). Netlify will serve the `.html` pages directly. No SPA fallback is configured because pages use explicit HTML filenames. Do not deploy Firebase Functions through Netlify; configure and deploy them separately with Firebase CLI after confirming the project, secrets, and rules.

## Gallery maintenance

The public gallery is `gallery.html`. Add photos as files under `images/`, then add each filename to the `photoFiles` list in the page script. The page creates responsive cards and lazy-loaded images from that list. Keep alt descriptions accurate and do not add children's names or identifying information in captions without approval. Add local MP4 videos under `videos/` and add a `<video controls preload="metadata" playsinline>` card with a `<source>` pointing to the actual file. The page currently displays the four existing MP4 files. Gallery content is maintained in the page; there is no gallery admin interface.

## Firebase status and security

Browser scripts use Firebase Authentication and Realtime Database; `functions/` contains payment related Cloud Functions. Firebase web configuration in the client is an identifier, not a service-account secret, but security must be enforced by database rules and API restrictions. No Realtime Database rules file is present in this repository. The checked-in Firestore rules currently permit all access only until 6 May 2026 and then deny access; those rules target Firestore, while the inspected contact/admin/payment code uses Realtime Database. Review and deploy appropriate rules for each actually used service before relying on Firebase features. Do not make either database publicly writable. The admin page's email check is client-side and is not sufficient authorization by itself.

Payment initiation cannot be considered production-ready from this static site yet. The backend has M-Pesa/Pesapal code, but the donation page did not call it; required endpoint configuration, provider credentials, callback validation, deployed rules, and a complete user flow need verification. Donation instructions shown on the site should be confirmed by the organization before publication.

## Existing pages

`index.html`, `about.html`, `programs.html`, `volunteer.html`, `partner.html`, `events.html`, `support.html`, `donate.html`, `gallery.html`, `contact.html`, `terms.html`, plus login, signup, register, profile, and admin pages. Some links in the existing project point to `testimonials.html`, which is not present.

## Audit checklist

### Critical

- [ ] Add and review Realtime Database rules for messages, donations, admin actions, and payment records; server-side authorization must enforce admin writes.
- [ ] Replace or verify all donation details and impact claims; configure and validate the payment provider flow before accepting payments.
- [ ] Review public handling of children's photos and videos, including consent and identifying captions.

### Important unfinished features

- [ ] Add gallery management to the existing admin workflow only after authorization rules are in place.
- [ ] Fix contact form behavior so database errors cannot report success; add spam controls.
- [ ] Review absent `testimonials.html` links and either provide verified testimonial content or remove those links.
- [ ] Verify contact addresses, event information, social URLs, and organization claims.

### Design and usability

- [ ] Normalize navigation, footer, responsive behavior, and encoding across the pages; the project contains multiple divergent page designs.
- [ ] Review alt text, form labels, focus states, and mobile layouts on every page.

### Security

- [ ] Establish service-specific Firebase rules and verify admin access on the server.
- [ ] Audit Cloud Functions input validation, CORS, callback authenticity, secrets, and error responses before deployment.

### Testing and deployment

- [ ] Review every internal link and asset path; run a browser review at mobile and desktop sizes.
- [ ] Configure Firebase separately from Netlify and verify production environment settings.
- [ ] Check payment, contact, and admin flows using authorized test credentials before launch.
