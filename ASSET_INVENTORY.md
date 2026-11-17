# Paivepo Art & Decor — Asset Inventory

**Audit date:** 2026-11-16
**Locations:** 63 image files in `images/`; two favicon files in the repository
root. Dimensions and decode status were checked in the local browser; byte sizes
are exact on-disk sizes. Aspect ratio is width divided by height, rounded to
two decimals. `—` means the file is not referenced by the current HTML, CSS, or
JavaScript.

## Images

| File (`images/`) | Format | Dimensions (ratio) | Bytes | References / observed use |
|---|---:|---:|---:|---|
| `apple-touch-icon.png` | PNG | 189×183 (1.03) | 11,233 | —; touch icon candidate |
| `artist-allick.png` | PNG | 500×624 (0.80) | 709,455 | —; legacy Allick portrait |
| `artist-allick.webp` | WebP | 500×624 (0.80) | 118,916 | `index.html`, `js/data.js`; artist portrait |
| `artist-portrait.jpg` | JPG | 1365×1820 (0.75) | 418,220 | —; exact duplicate of `artist-rooster.jpg` |
| `artist-portrait.webp` | WebP | 1365×1820 (0.75) | 194,632 | `index.html`, `js/data.js`; artist portrait |
| `artist-protea.webp` | WebP | 1440×1800 (0.80) | 207,098 | —; exact duplicate of `artist-william.webp` and `journal-1.webp` |
| `artist-rooster.jpg` | JPG | 1365×1820 (0.75) | 418,220 | `index.html`; picture fallback |
| `artist-rooster.webp` | WebP | 1365×1820 (0.75) | 315,132 | `index.html`; sculpture/artist imagery |
| `artist-studio.jpg` | JPG | 1440×1797 (0.80) | 860,422 | `index.html`; picture fallback |
| `artist-studio.webp` | WebP | 1440×1797 (0.80) | 729,602 | `index.html`; artist and journal imagery |
| `artist-william.jpg` | JPG | 1440×1800 (0.80) | 416,931 | —; exact duplicate of `journal-1.jpg` |
| `artist-william.webp` | WebP | 1440×1800 (0.80) | 207,098 | `index.html`, `js/data.js`; artist imagery |
| `backbench.jpg` | JPG | 896×1195 (0.75) | 170,796 | —; retained furniture source |
| `backbench_zoom.jpg` | JPG | 896×1195 (0.75) | 171,582 | —; retained furniture source |
| `bars_stool.jpg` | JPG | 896×1195 (0.75) | 130,193 | —; retained furniture source |
| `bars_stool_zoom.jpg` | JPG | 896×1195 (0.75) | 169,658 | —; retained furniture source |
| `bench.jpg` | JPG | 512×384 (1.33) | 42,444 | —; retained furniture source |
| `bench_zoom.jpg` | JPG | 1195×896 (1.33) | 152,280 | —; retained furniture source |
| `coll-commissions.webp` | WebP | 1440×1440 (1.00) | 858,364 | `index.html`; commissions collection |
| `coll-furniture.webp` | WebP | 1080×1185 (0.91) | 976,856 | —; exact duplicate of `furniture-swing-chair.webp` |
| `coll-paintings.webp` | WebP | 1170×876 (1.34) | 1,042,918 | `index.html`; paintings collection |
| `coll-sculpture.webp` | WebP | 1440×1800 (0.80) | 3,047,744 | `index.html`; sculpture collection |
| `furniture-swing-chair.webp` | WebP | 1080×1185 (0.91) | 976,856 | —; exact duplicate of `coll-furniture.webp` |
| `hanging_bench.jpg` | JPG | 896×1195 (0.75) | 151,470 | —; retained furniture source |
| `hanging_bench_zoom.jpg` | JPG | 896×1195 (0.75) | 167,469 | —; retained furniture source |
| `hanging_chair.jpg` | JPG | 896×1195 (0.75) | 113,851 | —; retained furniture source |
| `hero-bg.webp` | WebP | 1440×1794 (0.80) | 3,745,666 | `index.html`, `css/styles.css`; hero |
| `journal-1.jpg` | JPG | 1440×1800 (0.80) | 416,931 | `index.html`; journal fallback |
| `journal-1.webp` | WebP | 1440×1800 (0.80) | 207,098 | `index.html`; journal image; exact duplicate of `artist-protea.webp` and `artist-william.webp` |
| `journal-2.jpg` | JPG | 1440×1920 (0.75) | 333,918 | — |
| `journal-2.webp` | WebP | 1440×1920 (0.75) | 436,054 | `index.html`; journal image |
| `journal-3.jpg` | JPG | 1080×1080 (1.00) | 60,473 | —; exact duplicate of `og-image.jpg` |
| `journal-3.webp` | WebP | 1080×1080 (1.00) | 17,152 | —; exact duplicate of `og-image.webp` |
| `journal-4.jpg` | JPG | 750×1000 (0.75) | 118,772 | — |
| `journal-4.webp` | WebP | 750×1000 (0.75) | 33,364 | `index.html`; journal image |
| `og-image.jpg` | JPG | 1080×1080 (1.00) | 60,473 | `index.html`; Open Graph/Twitter share image |
| `og-image.webp` | WebP | 1080×1080 (1.00) | 17,152 | —; exact duplicate of `journal-3.webp` |
| `painting-elephant-dusk.webp` | WebP | 1440×1920 (0.75) | 576,924 | `js/data.js`; catalog painting |
| `painting-lion-portrait.webp` | WebP | 1440×1920 (0.75) | 180,968 | `js/data.js`; catalog painting |
| `painting-village-morning.webp` | WebP | 1071×1071 (1.00) | 166,554 | `js/data.js`; catalog painting |
| `painting-women-zimbabwe.webp` | WebP | 768×960 (0.80) | 75,880 | `js/data.js`; catalog painting |
| `placeholder.jpg` | JPG | Undecodable | 6 | —; invalid, unreferenced placeholder retained |
| `product-elephant.webp` | WebP | 768×768 (1.00) | 970,338 | `js/data.js`; catalog product |
| `product-flamingo.webp` | WebP | 1440×1799 (0.80) | 1,586,484 | `js/data.js`; catalog product |
| `product-guardian-1.webp` | WebP | 1086×1448 (0.75) | 124,876 | `js/data.js`; Guardian gallery |
| `product-guardian-2.webp` | WebP | 1086×1448 (0.75) | 188,910 | `js/data.js`; Guardian gallery |
| `product-guardian-3.webp` | WebP | 1086×1448 (0.75) | 133,884 | `js/data.js`; Guardian gallery |
| `product-guardian-4.webp` | WebP | 1086×1448 (0.75) | 162,488 | `js/data.js`; Guardian gallery |
| `product-guardian-5.webp` | WebP | 1448×1086 (1.33) | 171,038 | `js/data.js`; Guardian gallery |
| `product-lion.webp` | WebP | 1024×1365 (0.75) | 1,843,130 | `js/data.js`; catalog product |
| `product-peacock.webp` | WebP | 1440×1800 (0.80) | 229,262 | `js/data.js`; catalog product |
| `product-protea.webp` | WebP | 1440×1920 (0.75) | 496,434 | `index.html`, `js/data.js`; Protea artwork |
| `product-rhino.webp` | WebP | 511×404 (1.26) | 70,478 | —; not the active Guardian catalog image |
| `product-rooster.webp` | WebP | 1440×1440 (1.00) | 178,362 | `js/data.js`; catalog product |
| `product-zebra.webp` | WebP | 1440×1440 (1.00) | 134,568 | `js/data.js`; catalog product |
| `Rhino_1.jpeg` | JPEG | 1086×1448 (0.75) | 187,640 | —; retained original Rhino images |
| `Rhino_2.jpeg` | JPEG | 1086×1448 (0.75) | 266,516 | —; retained original Rhino images |
| `Rhino_3.jpeg` | JPEG | 1086×1448 (0.75) | 197,764 | —; retained original Rhino images |
| `Rhino_4.jpeg` | JPEG | 1086×1448 (0.75) | 224,624 | —; retained original Rhino images |
| `Rhino_5.jpeg` | JPEG | 1448×1086 (1.33) | 231,860 | —; retained original Rhino images |
| `studio.jpg` | JPG | 768×768 (1.00) | 295,624 | `index.html`; picture fallback |
| `studio.webp` | WebP | 768×768 (1.00) | 231,536 | `index.html`; studio imagery |
| `wire-art.webp` | WebP | 1024×1365 (0.75) | 180,082 | `index.html`, `js/data.js`; wire art |

## Root icons and other assets

| File | Dimensions | Bytes | Use |
|---|---:|---:|---|
| `favicon.ico` | 32×31 | 4,154 | Referenced by `index.html` |
| `favicon.png` | 32×31 | 4,154 | Not separately referenced; byte-identical to `favicon.ico` |
| `images/apple-touch-icon.png` | 189×183 | 11,233 | Not referenced |
| Inline SVG icons | In markup | — | Embedded in `index.html`; no separate SVG directory/files |
| Fonts | — | — | No local font files; Google Fonts CSS is requested by `index.html` |

## Summary

- 63 image files under `images/`; 35 are referenced by the current site and 28
  are currently unused. Unused does not imply safe to delete: several are
  retained furniture/Rhino sources.
- Every image under `images/` was fetched through the local preview. 62 decoded
  successfully; `placeholder.jpg` is a six-byte invalid file but is not
  referenced.
- Six exact duplicate groups were verified by SHA-256:
  - `artist-portrait.jpg` = `artist-rooster.jpg`
  - `artist-protea.webp` = `artist-william.webp` = `journal-1.webp`
  - `artist-william.jpg` = `journal-1.jpg`
  - `coll-furniture.webp` = `furniture-swing-chair.webp`
  - `journal-3.jpg` = `og-image.jpg`
  - `journal-3.webp` = `og-image.webp`
- The root `favicon.ico` and `favicon.png` are also byte-identical.
- Largest referenced files are `hero-bg.webp` (3,745,666 bytes),
  `coll-sculpture.webp` (3,047,744 bytes), `product-lion.webp` (1,843,130
  bytes), and `product-flamingo.webp` (1,586,484 bytes). Originals were
  preserved; no image conversion tooling was available.
- Image `src`, `srcset`, CSS background and catalog paths were checked against
  exact local files. No referenced image failed to load in the tested browser.
