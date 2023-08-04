# pretz.dev

## Todo

- [x] Figure out basic tech stack
- [x] Get ideas on layout and looks
- [x] Robots.txt
- [x] Sitemap.xml
- [x] favicon.ico
- [x] Make basic main page (HTML only)
- [x] Skip navigation link
- [x] Accessibility aria labels
- [x] Make basic CSS for main page
- [x] [Set up Cloudflare Pages](#cloudflare-pages-steps)
- [x] Finalize main page content
- [x] About page basic format
- [x] About page content
- [x] Projects page basic format
- [x] Projects page content
- [x] Contact page basic format
- [x] Contact page content
- [x] Targets and rel attributes on links
- [ ] Re-add the Content-Security-Policy to index and projects now that we're using some JS
- [ ] [Finalize designs](#finalize-design-steps)
- [ ] [Large screen sizes](#large-screen-size-improvements)
- [ ] [Small screen sizes](#small-screen-size-improvements)
- [ ] [About page improvements](#about-page-improvements)
- [ ] [Projects page improvements](#projects-page-improvements)
- [ ] [Contacts page improvements](#contacts-page-improvements)
- [ ] Note about techlogos not being my trademark (footer? They're on every page but contact. Ignoring that, contact makes the most sense to put this note on.)
- [ ] Theme switcher
- [ ] Custom 404 Page
- [ ] Add modern formats (webp/avif) to images with more-standard fallbacks (jpg/png)
- [ ] Assess how big the carousel images really need to be
- [ ] Site audit with Lighthouse
- [ ] Lighthouse follow-up
- [ ] [Code cleanup](#code-cleanup-steps)
- [ ] Wherever things happen from there

### Cloudflare Pages Steps

- [x] Basic setup
- [x] Set up custom domain
- [x] DNSSEC Records
- [x] Fix Cloudflare hiding the email

### Finalize Design Steps

- [x] Fix button text contrast
- [x] Fix button text size
- [x] Set up light-mode colors
- [x] Make a logo
- [x] Turn logo into an actual favicon.ico
- [x] Make "On This Page" links scroll slightly less far down the page, ideally keeping the margin like nav does
- [x] Project-preview projects initial design
- [x] techlogo images size consistency
- [x] techlogo images caption instead of image with words (and contrast issues)
- [x] techlogo images zoom in and display alt text in little popup bubble on hover
- [x] Stylize scrollbar
- [x] Change text highlight color
- [x] Change strong tag color
- [x] Fix the skip to content link (and rename the class)
- [x] Make an image carousel so I can have multiple images on projects. This will also fix the gap on the side of the current single image.
- [x] Add buttons to navigate between the slides of the carousel
- [ ] Fix carousel's bottom line not having the round corners (due to the scrollbar being beneath it)
- [ ] h4 and strong look bad in Firefox's render of Nunito
- [ ] Logo on footer
- [ ] p text gets too long and looks bad. Max at 75ch? 100ch? Time to research typography
- [ ] Bullet points have too large of margins
- [ ] Change the sidebar to indicate what part of the page they are on

### Small Screen Size Improvements

- [x] Move the sidebar to an expandable menu at the top below 667 px width
- [x] Add a border to the navbar?
- [ ] Close the menu when you click outside of it
- [ ] Close the menu when you click on a "On This Page" link?
- [ ] Adjust scrolling offset when clicking on a link in the menu
- [ ] tooltip's position:relative is somehow covering up the navbar's content
- [ ] Do something to make the list of a links feel more like a proper menu. Display as table? Make links take the full width?
- [ ] Add some sort of opening animation to the menu
- [ ] Adjust techlogo image size to fill the space when in single-column layout
- [ ] Images are very small at small sizes, consider adjusting margins?
- [ ] Header sizes are too big at small sizes
- [ ] Fix text run-on in small sizes

### Large Screen Size Improvements

- [ ] Above a certain width, move the image to the side (2-column layout)
- [ ] Above a certain width, move the project blocks be all in one row (3-column layout)
- [ ] Make nav headers and links bigger
- [ ] Carousel buttons will scroll until the image is 1.5 rem from the top of the screen. On larger screens, this may scroll the buttons off of the screen, resulting in a jittery process

### About Page Improvements

- [x] .NET and DNN are breaking out of their box
- [x] White looks bad
- [x] Fix colors in light mode
- [x] Cloudflare refuses to be vertically centered
- [x] Hover over for an explanation of what it is/is used for
- [x] Click to go to that tech's website (such as click on the DNN logo to go to [DotNetNuke](https://www.dnnsoftware.com/))
- [ ] Hover/Focus border has a gap at the bottom
- [ ] Add an arrow to signal where the tooltip is coming from
- [ ] Assess the accessibility of tooltips
- [ ] tooltips can go off-screen when content is high on the screen
- [ ] Wider tooltips that do not go off the screen

### Projects Page Improvements

- [x] Google Analytics is breaking out of its box
- [x] Add GitHub links to the projects' repos
- [x] Add other relevant links to the projects, such as the website link, ESOUI link, etc.
- [ ] Split the "on this page" section to websites, desktop apps, mobile apps, AddOns/mods, hardware, etc.
- [ ] Add the rest of my projects.
- [ ] Visual Studio is smaller than the rest of the techlogos.
- [ ] Techlogos are taking the focus away from the project. Are they too big? Wrong color?
- [ ] What about if we made the post color for projects the same as projects are on the front page? That would simplify the color for the problem above. Perhaps splitting the projects into the buckets from above could be the "base", then the projects would stack on top like on the homepage

### Contact Page Improvements

- [ ] Links look bad in a straight list. Box them up into a grid?

### Code Cleanup Steps

- [ ] Remove ununsed classes
- [ ] Simplify the classes and class selections
- [ ] Make HTML and general layout consistent between pages
- [ ] Clean up and organize CSS
- [ ] Split page-specific CSS into their own stylesheets 
- [ ] Combine duplicate code (CSS, primarily)

### Long-Term Enchancements

- [ ] It could be a fun project to execute the carousel button script before shipping the HTML to them, eliminating the need for the script entirely