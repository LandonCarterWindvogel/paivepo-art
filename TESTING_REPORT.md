# Paivepo Art & Decor — Testing Report

**Date:** 2026-11-16
**Target:** Local preview at `http://127.0.0.1:8765/` with an SPA fallback.
No live deployment was used.

## Automated / static checks

| Check | Result |
|---|---|
| Asset path audit | All current local image references resolved; all 63 files under `images/` were fetched. |
| Image decoding | 62 decoded successfully. `images/placeholder.jpg` is invalid (6 bytes) and unreferenced. |
| Asset dimensions / file sizes | Collected for every image; see [ASSET_INVENTORY.md](./ASSET_INVENTORY.md). |
| Git whitespace check (`git diff --check`) | Passed; Git emitted only the configured LF-to-CRLF working-copy warnings. |
| Project build / test runner | None is configured (no package manifest or test scripts). |

No HTML validator, Lighthouse, formal accessibility scanner, dependency scanner,
or dedicated secret-scanning tool was available in the local project.

## Browser checks

The integrated browser was used for manual checks; its engine/version was not
recorded, so no browser brand or version is claimed.

| Requested viewport | Measured viewport |
|---|---|
| 320×640 | 320×640 |
| 375×812 | 375×812 |
| 430×932 | 430×932 |
| 600×900 | 600×900 |
| 768×1024 | 768×1025 |
| 1024×768 | 1025×768 |
| 1280×800 | 1280×800 |
| 1440×900 | 1440×900 |
| 1920×1080 | 1920×1080 |

The integrated preview rounded two viewport sizes by one pixel. The app views
were reviewed across this matrix for horizontal overflow, clipped content,
broken imagery, and major responsive layout failures; none were observed.

Interactions exercised:

- Navigation across Home, Collection, Artists, Story, Journal, and Contact.
- Gallery category filtering, available-only filtering, and load-more behavior.
- Opening a product, product-specific URL/canonical/share URLs, add-to-cart,
  quantity changes, remove, and browser history.
- Product and Guardian gallery image loading.
- Mobile navigation at 320px: open state, focus entry, reverse-tab wrap,
  Escape close, and focus return.
- Contact-form required-field validation.
- Newsletter server-error handling using a simulated HTTP 500 response. The
  form showed an error and re-enabled the button; this was not a real Netlify
  submission.
- Cart persistence sanitization using an intentionally untrusted stored entry;
  catalog display values were restored and injected markup did not render.
- No uncaught page errors or broken loaded image elements were observed. The
  simulated newsletter HTTP 500 was intentionally logged as an error.

## Not verified

- Chrome, Edge, Firefox, and Safari as separate browser targets.
- Exact 768×1024 and 1024×768 browser dimensions due the preview's one-pixel
  viewport rounding.
- Real Netlify form processing, live redirects/headers, map embedding on the
  deployed domain, or outbound link reachability.
- Shopify checkout or product variant IDs. 12 of 13 catalog items have no
  nonzero variant ID in the current data.
- Lighthouse/Core Web Vitals, formal WCAG 2.2 AA conformance, or assistive
  technology output.

Do not treat these local results as a production deployment sign-off.
