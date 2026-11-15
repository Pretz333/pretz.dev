# pretz.dev

My personal portfolio site. It's built with [Eleventy](https://www.11ty.dev/) using plain Nunjucks templates and hand-written CSS and JS, and it's deployed as static assets on Cloudflare Workers.

## Development

```sh
npm install
npm run dev     # build and serve with live reload
npm run build   # production build to _site/
```

Deploy with `npx wrangler deploy` (config in `wrangler.jsonc`).

JavaScript is only ever an *enhancement*. Someone with JavaScript disabled will still get a fully working site, just missing a few niceties that aren't possible or aren't worth building in plain HTML and CSS.

## Todo

- [ ] [Design](#design)
- [ ] [Small screens](#small-screens)
- [ ] [Large screens](#large-screens)
- [ ] [About page](#about-page)
- [ ] [Projects to add](#projects-to-add)
- [ ] [Contact page](#contact-page)
- [ ] [Code cleanup](#code-cleanup)
- [ ] Assess how big the carousel images really need to be
- [ ] Add a note that the techlogos aren't my trademarks (footer? They're on every page but contact. Ignoring that, contact makes the most sense for it.)
- [ ] Site audit with Lighthouse
- [ ] Lighthouse follow-up
- [ ] Other pages to add
- [ ] Articles to write?
  - [ ] Conference talks I've given
  - [ ] Training documentation I wrote
  - [ ] Software I use, why that software, deploy steps
  - [ ] Hardware/Server Philosophy

### Design

- [x] Fix the carousel's bottom edge not having round corners (the scrollbar sits beneath it)
- [x] Fix the carousel showing a scrollbar when there's only one slide
- [x] Use `overflow-clip-margin` to fix the corners not matching
- [ ] h4 and strong look bad in Firefox's render of Nunito
- [ ] h1s in Nunito also don't look great after the font size changes
- [ ] p text gets too long and looks bad
  - [ ] Max at 75ch? 100ch? Time to research typography
  - [ ] also check line height
- [ ] Links are all one size. Tie them to the font size of their parent element
- [ ] After header anchor links look off (too small and misaligned?)
- [ ] Decide between the current GoScouting video with rising bars (sunset), or just the clouds moving as a looping gif
- [ ] Use a mobile video for GoScouting and remove carousel.js entirely?

### Small Screens

- [ ] Adjust techlogo image size to fill the space in the single-column layout
- [ ] Images are very small at small sizes. Adjust margins?
- [ ] Fix text running on at small sizes
  - [ ] Decrease header size?
- [ ] At zoom levels >200%, the small-screen header takes up too much space. Flow to 1 row with margin-block?
- [ ] Getting tooltips on mobile kinda sucks (press and hold on each logo). Do I need the links or should a click simply open the tooltip?

### Large Screens

- [ ] Above a certain width, move the image to the side (2-column layout)
- [ ] Above a certain width, put the project blocks in one row (3-column layout)
- [ ] Add a max-width to the sidebar?
- [ ] Carousel buttons will scroll until the image is 1.5 rem from the top of the screen. On larger screens, this may scroll the buttons off of the screen, resulting in a jittery process

### About Page

- [ ] Add picture of my laptop?

### Projects to Add

- [ ] the physical server
- [ ] personal NAS w/ apps for compute
- [ ] n8n SQLite -> Postgres migration script? It kinda sucks, but it work(s/ed)
- [ ] TORN scripts
- [ ] game save editors

### Contact Page

- [ ] Links look bad in a straight list. Box them up into a grid?
- [ ] Add a contact form
- [ ] Clarify that I'm available for contract work

### Code Cleanup

- [ ] Review comments in eleventy.config.js (some apply to the site I originally wrote it for, not this one)
- [ ] Remove unused classes
- [ ] Simplify classes and selectors
- [ ] Clean up and organize CSS
- [ ] Split page-specific CSS into its own stylesheets
- [ ] Combine duplicate code (mostly CSS)
- [ ] Minify CSS during build
- [ ] Remove empty lines from the HTML output (leftovers from comments, njk files, etc.)
