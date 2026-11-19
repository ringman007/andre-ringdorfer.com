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

The homepage links to `ringman007`. `github-calendar.js` loads the past year’s dates, exact counts and activity levels from `https://github-contributions-api.jogruber.de/v4/ringman007?y=last` when the calendar approaches the viewport. Each day supports hover, tap and keyboard focus; arrow keys move between days, Home/End jump to the first/last day, and Escape dismisses the tooltip. Dates are formatted in UTC so they stay on the correct calendar day in every visitor’s timezone.

The static image from `https://ghchart.rshah.org/ringman007` remains as a fallback if JavaScript or the data service is unavailable. Both external services cache GitHub data, so updates may take time to appear. No API token or build step is needed. On narrow screens, the calendar scrolls horizontally. GitHub profile links are also in both pages’ navigation, footer and Person structured data.

## GoodInGoodOut preview

The homepage app illustration is recreated in HTML/CSS from the iOS interface, with no screenshot downloads required at runtime. `gigo-demo.js` cycles through meal logging, daily totals and dashboard trends. Scene buttons select a screen and pause playback; Play resumes it. Playback stops while the phone is offscreen or the browser tab is hidden. Visitors who prefer reduced motion see a static daily view and can select other screens.

## DailyMoney product film

`money-demo.css` and `money-demo.js` power the four-scene portfolio preview: Dashboard, Changes, Holdings and Spending. It uses entirely fictional institutions, balances, allocations, transactions and performance figures; it has no connection to a financial account or private dashboard. The portfolio values, change waterfall, holdings and spending categories reconcile within the demo. Each six-second chapter keeps the complete screen in view. Screen buttons pause playback on the selected view; Play resumes from the current point. Playback pauses offscreen and in hidden tabs, and reduced-motion visitors get a still preview with manual navigation.
