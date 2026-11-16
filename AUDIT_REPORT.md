# Paivepo Art & Decor — Audit Report

**Audit date:** 2026-11-16
**Project:** `LandonCarterWindvogel/paivepo-art`
**Scope:** Local static-site repository only. No live site was changed or deployed.

## Project structure

This is a static, client-rendered single-page application. `index.html` contains
the page views and shared dialogs; ES modules in `js/` provide navigation,
catalog, gallery, cart, forms, and other interactions. Styles are split across
three CSS files. There is no package manifest, framework, or project build/test
runner. Images are stored under `images/`; Google Fonts are requested remotely.

The client-side routes are `/`, `/gallery`, `/artists`, `/story`, `/journal`,
`/contact`, and `/product?id=<catalog-id>`. Netlify rewrites client routes to
the app shell. The GitHub Pages workflow publishes `index.html` as `404.html`
for route fallback.

## Findings and disposition

| Priority | Finding | Disposition |
|---|---|---|
| High | Several picture fallbacks pointed to nonexistent JPGs; one journal card paired a Paivepo logo WebP with an unrelated artist fallback. | Corrected the missing paths and made the journal card consistently use the existing studio portrait. |
| High | Product views did not retain a product identifier in the URL, making direct sharing/reload unreliable. | Added `?id=` product routes, canonical/social metadata updates, and browser-history handling. |
| High | Newsletter submission treated an HTTP error response as success. | Non-2xx responses now show a failure notice, restore the submit control, and log the failure. |
| High | Persisted cart entries could supply display data instead of being rebuilt from the catalog. | Cart items are now reconstructed from trusted catalog records; invalid entries are discarded. |
| Medium | Image error handling used inline handlers that conflicted with the configured script CSP; empty-source modal images could be misclassified. | Centralized image-error handling and skip empty sources. |
| Medium | Netlify's CSP did not permit the existing Google Maps frame. | Added a narrowly scoped `frame-src https://www.google.com` directive. |
| Medium | Sitemap entries used fragment URLs instead of the clean client routes. | Updated sitemap URLs to the app's clean routes. |
| Medium | GitHub Pages did not provide a not-found fallback for client routes. | The workflow now creates `404.html` from the app shell. |
| Medium | Asset collection contains unused and byte-identical files; a few referenced images are large. | Recorded in [ASSET_INVENTORY.md](./ASSET_INVENTORY.md). No source image was deleted or recompressed. |
| Medium | Product checkout readiness cannot be confirmed: only 1 of 13 catalog items has a nonzero Shopify variant ID. | Requires verified commerce/catalog IDs from the business; no values were invented. |
| Medium | The homepage calls Allick Malawian while other content identifies him as Zimbabwean. | Left unchanged pending business confirmation. |
| Low | The two root favicon files are identical; the provided Apple touch icon is not referenced. | Documented; retained without changing branding assets. |

## Quality review

- **Navigation and functionality:** Main views, gallery filters/loading, product
  deep links/sharing, cart interactions, mobile navigation, and form validation
  were manually exercised in a local browser.
- **Responsive behavior:** The requested viewport matrix was reviewed for page
  overflow and broken image/layout behavior. See [TESTING_REPORT.md](./TESTING_REPORT.md)
  for exact measured sizes and limitations.
- **Accessibility:** Semantic landmarks, image alternatives, keyboard operation,
  mobile-menu state, and focus behavior were reviewed manually. This is not a
  formal WCAG conformance audit; contrast and assistive-technology testing
  remain outstanding.
- **SEO:** Existing metadata and structured data were inspected. Product pages
  now update canonical and social URLs when viewed in the client. Search engine
  rendering of this client-side metadata was not independently verified.
- **Security:** Reviewed frontend DOM/data handling and Netlify headers. The
  cart no longer trusts persisted display values. CSP retains
  `style-src 'unsafe-inline'` for current styling and allows Google Fonts and
  the existing Google Maps frame; deployment headers were not checked against
  a live response.
- **Performance:** Lazy image behavior and explicit image dimensions are used
  in the existing markup. Large originals and duplicate assets remain; no
  image optimizer or Lighthouse run was available.
- **Links and external integrations:** Internal client navigation was tested.
  External link reachability, live Netlify form processing, and checkout were
  not tested.

## Remaining work / release gates

1. Confirm Allick's origin and update the conflicting content only with
   business approval.
2. Obtain and validate variant IDs for the 12 catalog products without one;
   verify checkout end-to-end in an authorized preview.
3. Consider optimizing the largest images while preserving the original files
   and image quality.
4. Run automated accessibility/performance audits and test target browsers
   when those tools/environments are available.
5. Verify Netlify routing, security headers, map, and form behavior in a
   controlled deployment preview before launch.

No deployment was performed as part of this audit.
