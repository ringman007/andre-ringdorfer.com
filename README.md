# andre-ringdorfer.com

Personal site. Plain static HTML, CSS and a little JavaScript, served by GitHub Pages with the custom domain in `CNAME`.

- `index.html`: homepage (AI work), runs on Hong Kong time with a day and night skyline
- `experience.html`: results, work history, education and languages
- `site.css`: homepage styles; `footer.css`: footer shared by both pages
- `llms.txt`: plain-text profile for AI assistants and search engines
- `robots.txt`, `sitemap.xml`: crawler rules (search and AI crawlers welcome) and page list
- `favicon.*`, `apple-touch-icon.png`, `og-image.jpg`: browser icons and the link-preview card
- SEO/AEO: each page has a canonical URL, Open Graph/Twitter tags and JSON-LD (Person, WebSite, ProfilePage). The homepage FAQPage JSON-LD and the Q&A section in `llms.txt` copy the "Ask my agent" answers in `index.html`; update all three together.

## GitHub contributions

The homepage links to `ringman007` and embeds the past-year contribution calendar from `https://ghchart.rshah.org/ringman007`. The external service refreshes and caches GitHub data, so updates may take time to appear. No API token or build step is needed. If the image cannot load, the page shows a direct link to the GitHub contribution calendar. On narrow screens, the calendar scrolls horizontally. GitHub profile links are also in both pages’ navigation, footer and Person structured data.
