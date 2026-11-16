# Paivepo Art & Decor

This is the website I am building for **Paivepo Art & Decor**, a premium African art and decor business based at Old Nick Village in Plettenberg Bay.

This project is deliberately image-led. The artwork is the star of the show; my job is to build the stage without accidentally becoming the star myself.

## Why I built it this way

Paivepo has beautiful, handcrafted work, so I did not want the website to feel like a generic online shop with a grid of boxes and a "Buy Now" button slapped on everything.

I focused on large imagery, editorial spacing, restrained UI and a clear path from discovering the work to making an enquiry.

The site needs to feel premium without becoming difficult to use.

## What I built

- Custom responsive website design
- Mobile-first layouts
- Artist and product-focused presentation
- Interactive navigation and content sections
- Client enquiry/contact flow
- Image-led visual system
- Performance-conscious image handling
- Semantic HTML and responsive CSS
- SEO foundations, including metadata, structured content, `robots.txt` and `sitemap.xml`
- Netlify deployment configuration
- GitHub Pages public preview
- Vanilla HTML, CSS and JavaScript — no frontend framework

## Artists and work

The site is structured to accommodate different makers and disciplines, including:

- Beaded sculpture
- Oil painting

The content can grow as the client adds more artists, products and information.

Furniture is sold through the separate Shopify storefront at
[hangingchairs.co.za](https://hangingchairs.co.za/). Paivepo remains hosted on
Netlify; the site switch links visitors between the two storefronts. The
product JPGs are kept in `images/` as source files and should also be uploaded
to the corresponding Shopify products:

- `bench.jpg` and `bench_zoom.jpg`
- `bars_stool.jpg` and `bars_stool_zoom.jpg`
- `backbench.jpg` and `backbench_zoom.jpg`
- `hanging_chair.jpg`
- `hanging_bench.jpg` and `hanging_bench_zoom.jpg`

## Technology

I kept the technology deliberately lightweight:

- HTML5
- CSS3
- Modern JavaScript
- Semantic markup
- Responsive design
- SEO and metadata
- Netlify
- GitHub Pages for the current public preview

No framework was needed. This is a static website, so I built it like one.

## Project structure

- `index.html` — app shell, page views, shared dialogs and metadata
- `css/` — site, responsive and brand-bridge styles
- `js/` — ES modules for navigation, content, catalog, cart and interactions
- `images/` — artwork, artist and site imagery
- `netlify.toml` — hosting headers and client-route redirects
- `.github/workflows/deploy-pages.yml` — GitHub Pages workflow

The site has no package manifest, build step or project test runner. It uses
static HTML, CSS and JavaScript modules; serve it over HTTP rather than opening
`index.html` as a local file.

## Local preview and testing

From the repository root, use a static HTTP server, for example:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000/`. This basic server is suitable for the app
shell and client-side navigation. Refreshing clean routes such as `/gallery`
requires a server with an SPA fallback; use Netlify Dev with the redirects in
`netlify.toml` when available. No Netlify CLI dependency is included in this
repository.

There are no `npm install`, build, lint or test commands for this project.
Manual and browser checks, their measured viewport sizes, and limitations are
recorded in [TESTING_REPORT.md](./TESTING_REPORT.md).

## Audit documentation

- [AUDIT_REPORT.md](./AUDIT_REPORT.md) — findings, fixes and release gates
- [ASSET_INVENTORY.md](./ASSET_INVENTORY.md) — image metadata, references and
  duplicate/unused assets
- [CHANGELOG.md](./CHANGELOG.md) — milestone summary
- [TESTING_REPORT.md](./TESTING_REPORT.md) — checks performed and limitations

## Git workflow

Check `git status --short --branch` before editing, work on a dedicated feature
branch, and review `git diff --check` and the complete diff before committing.
Do not force-push or deploy without explicit approval.

## Current status

**Client work — pre-launch.**

The website is substantially built, but the final public launch depends on the remaining business content and launch requirements being supplied and approved by the client.

The current GitHub Pages preview is available here:

https://landoncarterwindvogel.github.io/paivepo-art/

## A note to future me

Do not replace beautiful client photography with random stock images because you are impatient.

Do not add five JavaScript libraries to make a gallery slide left.

And definitely do not forget that the whole point of this site is to make the artwork look incredible while keeping the actual website quiet, fast and easy to use.

That is the job.
