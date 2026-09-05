import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import fontAwesomePlugin from "@11ty/font-awesome";
import { DateTime } from "luxon";
import dotenv from 'dotenv';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Pull environment variables (secrets) from .env
	dotenv.config();

	/** Preprocessors
	 * Preprocessors modify content in templates *e.g. njk files) before they're process by 11ty proper
	 * See https://www.11ty.dev/docs/config-preprocessors
	 * */
	
	// For drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft) data.title = `${data.title} (draft)`;
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
	});

	/** Passthrough File Copy
	 * Copy the contents of something directly to the output folder
	 * See https://www.11ty.dev/docs/copy/
	 * */

	eleventyConfig
		// Instead of _site/public/css, just do _site/css via options
		.addPassthroughCopy({
			"./public/": "/", // The entire public folder and all contents
			"./content/img/": "/img", // The entire img folder and all contents
			"./content/video/": "/video" // Video clips (e.g. carousel slides) - not run through the image pipeline
		});

	/**
	 * Watch Targets
	 * Run Eleventy when these files change
	 * See https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
	 * */

	eleventyConfig.addWatchTarget("public/css/**/*.css");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}"); // For the image pipeline
	eleventyConfig.addWatchTarget("content/video/**/*.mp4");

	/**
	 * Plugins
	 * Plugins are custom code that add additional functionality that Eleventy can import into a project from an external repository.
	 * See https://www.11ty.dev/docs/plugins/
	 * */

	// Bundler Plugin: https://www.11ty.dev/docs/plugins/bundle/
	// Creates small plain-text bundles of code to embed on each page
	
	// TODO: look at this section
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
	});

	// TODO: look at this section
	// Bundle <script> content and adds a {% js %} paired shortcode
	/*eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});*/

	// Navigation Plugin: https://www.11ty.dev/docs/plugins/navigation/
	// Create hierarchical navigation, supports breadcrumbs too!
	eleventyConfig.addPlugin(pluginNavigation);

	// HTML Base Plugin: https://www.11ty.dev/docs/plugins/html-base/
	// Emulate the <base> element by adding a prefix to all URLs in .html output files.
	eleventyConfig.addPlugin(HtmlBasePlugin);

	// InputPath to URL Plugin: https://www.11ty.dev/docs/plugins/inputpath-to-url/
	// Maps an input file path to its output URL (e.g. href="image_in_folder.png" => href="/articles/article-4/image_in_folder.png")
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	// FontAwesome Plugin: https://github.com/11ty/eleventy-plugin-font-awesome
	// Converts the i elements with font awesome markup to an optimized and re-usable (on that page) svg, meaning each icon only loads once
	eleventyConfig.addPlugin(fontAwesomePlugin, {
		// transform: 'i[class]',
		shortcode: false,
		failOnError: true,
		defaultAttributes: {
			class: 'icon-svg',
		},
	});

	// RSS Feed Plugin: https://www.11ty.dev/docs/plugins/rss/
	// Makes an RSS feed of our most recent articles
	// TODO: look at this section
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		stylesheet: "/feed/pretty-atom-feed.xsl",
		collection: {
			name: "articles",
			limit: 15,
		},
		metadata: {
			language: "en",
			title: "Pretz",
			subtitle: "Hiya, I'm Pretz! I enjoy making software projects to solve real problems.",
			base: "https://pretz.dev/",
			author: {
				name: "Pretz",
			},
		}
	});

	// Image Plugin: https://www.11ty.dev/docs/plugins/image/
	// Automatically converts images to a picture element with a srcset of converted images (e..g a input .png will be a .webp OR a .png)
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Formats to convert each image to
		// https://www.11ty.dev/docs/plugins/image/#output-formats
		formats: ["avif", "webp", "auto"],
		widths: ["auto"],
		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				// <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			}
		},

		// For animated images, e.g. gif or webp
		// sharpOptions: {
		// 	animated: true,
		// },
	});

	// Id Attribute: https://www.11ty.dev/docs/plugins/id-attribute/
	// A plugin to add `id` attributes to headings, which can then be used to make header links
	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	/** 
	 * Filters
	 * Functions which can be used within templating syntax (e.g. njk files) to transform data
	 * https://www.11ty.dev/docs/filters/
	 * */

	// Convert Dates to a standard readable format
	// Used in unfinished article layout
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	// Convert Dates to a standard processable format
	// Used in unfinished article layout
	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	// Used to filter # of articles to a limit (e.g. from all latest articles to just 5 most recent articles)
	eleventyConfig.addFilter("limit", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) return [];
		return array.slice(0, Math.abs(n));
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("extractMonth", (title) => {
		if (!title || typeof title !== 'string') return '';

		// Split the title into an array of words based on spaces
		const words = title.trim().split(/\s+/);

		// Check if there are at least two words (index 1 is the second word)
		if (words.length >= 2) return words[1];

		// Return an empty string or the original word if there's only one word
		return '';
	});

	// Remove common tags from a list
	// Only used in unfinished article layout to remove these tags as they're used for another purpose
	// E.g. "all" is all articles, "nav" is for those to be displayed in the top bar, etc.
	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || [])
			.filter(tag => ["all", "nav", "article", "articles"]
			.indexOf(tag) === -1);
	});
	
	// This filter takes the comma-separated string Nunjucks creates 
	// and turns it back into a real Array for Eleventy
	eleventyConfig.addFilter("fixTags", (tags) => {
		if (Array.isArray(tags)) return tags;
		if (typeof tags === "string") return tags.split(",");
		return [];
	});

	// Sort items alphabetically, aptly named
	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	// Sort articles alphabetically by their title
	// There's probably a way to combine this with sort Alphabetically,
	// but it is used enough that I don't mind it being separate.
	eleventyConfig.addFilter("sortByTitle", function(collection) {
		// Ensure the collection exists and is an array, then make a copy of said array.
		const collectionToSort = (collection || []).slice(); 
		
		collectionToSort.sort((a, b) => {
			const titleA = (a.data.title || "").toUpperCase();
			const titleB = (b.data.title || "").toUpperCase();
			
			return titleA.localeCompare(titleB);
		});
		
		return collectionToSort;
	});
	
	// Filter to check if an item has ALL of the specified tags
	eleventyConfig.addFilter("filterByTags", (collection, requiredTags) => {
		// Ensure the collection exists and is an array, then make a copy of said array.
		if (!collection || !Array.isArray(collection)) return [];
		if (!requiredTags || !Array.isArray(requiredTags)) return collection;
		const articles = (collection || []).slice();

		return articles.filter(item => {
			// Get the articles's tags, defaulting to an empty array
			const itemTags = item.data.tags || [];

			// Check if ALL requiredTags are present in itemTags
			return requiredTags.every(requiredTag => itemTags.includes(requiredTag));
		});
	});

	eleventyConfig.addFilter("log", function(content) {
		console.log(content);
	});

	/**
	 * Shortcodes
	 * Make reusable content for use in templates (e.g. njk files)
	 * See https://www.11ty.dev/docs/shortcodes/
	 * */

	// The current year as a 4 digit number
	// Currently not used. Used for the copyright year in the footer on some of my sites
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	// When the site was last built
	// Currently not used
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Count of primary site pages (those with an eleventyNavigation entry, i.e. shown in the top nav).
	// Pass `collections.all` in from the template, e.g. {% pageCount collections.all %}
	eleventyConfig.addShortcode("pageCount", (allPages) => {
		return (allPages || []).filter(page => page.data.eleventyNavigation).length;
	});

	/**
	 * Transforms
	 * The opposite of the preprocessor - transforms modify the output of the build process
	 * See https://www.11ty.dev/docs/transforms/
	 * */

	// Wrap tables in a <div> that allows for scrollable overflow, preventing tables from getting cut off
	eleventyConfig.addTransform("wrapTables", function(content, outputPath) {
		// Only run this transform on HTML output
		if (!outputPath || !outputPath.endsWith(".html")) return content;
		
		const regex = /<table\b[\s\S]*?<\/table>/gi;
		
		// Replace all <table> elements with the wrapped version
		const wrappedContent = content.replace(regex, (match) => {
			// tabindex="0" makes this div focusable, which is necessary if it has scroll
			// See Accessibility under https://piccalil.li/blog/styling-tables-the-modern-css-way/
			return `<div class="table-wrapper" tabindex="0">${match}</div>`;
		});

		return wrappedContent;
	});

	// Add anchors to select headings
	eleventyConfig.addTransform("html-anchor-transform", function(content, outputPath) {
		// Only run this transform for HTML output
		if (!outputPath || !outputPath.endsWith(".html")) return content;
		
		// (<h([23])[^>]*id=['"]([^'"]+)['"][^>]*>): Captures the opening tag (Group 1), heading level (Group 2), and ID value (Group 3).
		// (.*?): Captures the content of the heading (Group 4).
		// (<\/h\2>): Captures the closing tag, matching the level (Group 5).
		const regex = /(<h([23])[^>]*id=['"]([^'"]+)['"][^>]*>)(.*?)(<\/h\2>)/gsi;
		// aria-hidden on the icon (decorative), not the link itself, which stays focusable
		// and gets a real accessible name via aria-label so AT users know what it does.
		const faLinkSymbol = '<svg class="icon-svg" aria-hidden="true" focusable="false"><use href="#fas-fa-link" xlink:href="#fas-fa-link"></use></svg>'
		
		content = content.replace(regex, (
			match,          // Full match string
			openingTag,     // Group 1: <h2 id="x" ...>
			headingLevel,   // Group 2: 2, 3, or 4. Unused here but used in the original string, so we have to have it here.
			idValue,        // Group 3: The actual ID string
			contentBody,    // Group 4: The content inside the heading
			closingTag      // Group 5: </h2> or </h3>
		) => {
			// If the header content is a link, return the original match without adding an anchor.
			const isLinkHeader = contentBody.trim().toLowerCase().startsWith('<a');
			if (isLinkHeader) return match;
			
			// Construct the anchor link using the captured ID value
			const headingText = contentBody.replace(/<[^>]+>/g, '').trim();
			const anchorLink = `<a href="#${idValue}" aria-label="Link to ${headingText} heading" class="header-anchor">${faLinkSymbol}</a>`;
			
			// This places an anchor link after the heading's content.
			return openingTag + contentBody + " " + anchorLink + closingTag;
		});

		return content;
	});
	
	// Builds the "On This Page" sidebar nav from `data-anchor="Title"` attributes
	// found in the markup, instead of a hand-maintained `anchors` list that drifted
	// from the actual layout. See the "page-anchor-list" placeholder in base.njk.
	eleventyConfig.addTransform("generatePageAnchors", function(content, outputPath) {
		// Only run this transform for HTML output
		if (!outputPath || !outputPath.endsWith(".html")) return content;
		
		// Lookaheads let `id` and `data-anchor` appear in either order within the tag.
		const anchorRegex = /<[a-z0-9]+\b(?=[^>]*\sid=["']([^"']+)["'])(?=[^>]*\sdata-anchor=["']([^"']+)["'])[^>]*>/gi;
		
		const anchors = [];
		let match;
		while ((match = anchorRegex.exec(content)) !== null) {
			anchors.push({ id: match[1], title: match[2] });
		}
		
		if (anchors.length === 0) {
			// No anchor points on this page: drop the whole "On This Page" nav.
			return content.replace(/<nav class="page-nav-container"[\s\S]*?<\/nav>\s*/i, "");
		}
		
		const listItems = anchors.map(a => `<li><a href="#${a.id}">${a.title}</a></li>`).join("");
		return content.replace('<ul id="page-anchor-list"></ul>', `<ul id="page-anchor-list">${listItems}</ul>`);
	});
	
	// Builds carousel's nav buttons (and the ids they link to).
	// Every slide is wrapped in a `<div class="carousel-slide">`
	eleventyConfig.addTransform("carouselButtons", function(content, outputPath) {
		// Only run this transform for HTML output with carousels
		if (!outputPath || !outputPath.endsWith(".html")) return content;
		if (!content.includes('class="carousel"')) return content;

		// Finds the closing div tag for the carousel, starting at `searchFrom` while tracking
		// <div>/</div> nesting since a carousel's content is an unknown number of slide divs.
		function findCarouselEnd(html, searchFrom) {
			const divRegex = /<\/?div\b[^>]*>/g;
			divRegex.lastIndex = searchFrom;
			let depth = 1;
			let match;
			while ((match = divRegex.exec(html)) !== null) {
				depth += match[0][1] === "/" ? -1 : 1;
				if (depth === 0) return divRegex.lastIndex;
			}
			return -1;
		}

		// Since we're running through every HTML page with carousels, we need to check if those carousels have any slides
		const carouselMatches = [...content.matchAll(/<div class="carousel">/g)];
		let result = "";
		let cursor = 0; // end of the last carousel already copied into `result`
		let carouselIndex = 0; // shared across every carousel on the page, so ids stay unique when a page has more than one. The first number in carou_#_slide_#

		// Walk each `.carousel` div on the page
		for (let i = 0; i < carouselMatches.length; i++) {
			const match = carouselMatches[i];
			const openTagEnd = match.index + match[0].length;
			const closeTagEnd = findCarouselEnd(content, openTagEnd); // skips past the slide divs to this carousel's own close
			if (closeTagEnd === -1) continue;

			// Only the slide's opening tag matters as we're simply inserting an id into that tag
			const carouselInnerHTML = content.slice(openTagEnd, closeTagEnd - "</div>".length);
			const slideStarts = [...carouselInnerHTML.matchAll(/<div class="carousel-slide">/g)];

			// Copy through any untouched HTML before this carousel, plus its opening tag as-is
			result += content.slice(cursor, match.index) + match[0];

			// Only multi-slide carousels need nav buttons/ids. A single slide has nothing to jump to
			if (slideStarts.length > 1) {
				const index = carouselIndex++;

				// Rebuild the inner HTML, giving each slide's opening div an id to link/scroll to
				let newInner = "";
				let innerCursor = 0;
				const buttons = [];
				slideStarts.forEach((slideStart, slideIndex) => {
					const id = `carou_${index}_slide_${slideIndex}`;
					// untouched gap before this slide, then its opening tag with the new id
					newInner += carouselInnerHTML.slice(innerCursor, slideStart.index) + `<div class="carousel-slide" id="${id}">`;
					innerCursor = slideStart.index + slideStart[0].length;
					buttons.push(`<a class="carousel-button" href="#${id}"> ${slideIndex + 1}</a>`);
				});
				newInner += carouselInnerHTML.slice(innerCursor); // rest of the last slide plus any trailing HTML, all untouched

				result += newInner + "</div>" + `<div class="carousel-button-holder">${buttons.join("")}</div>`;
			} else {
				// No slides to id and no buttons to add, just close the div unchanged
				result += carouselInnerHTML + "</div>";
			}

			cursor = closeTagEnd;
		}
		result += content.slice(cursor); // copy through anything after the last carousel

		return result;
	});

	// The font-awesome plugin's {% getBundle "fontawesome" %} in base.njk hardcodes
	// style="display: none;" on the <svg> of each icon. Our CSP blocks inline CSS, so
	// each icon logs an error in the console. As we already have these hidden via 
	// a wrapper, these inline styles are unneeded and can be removed. However, the
	// fontawesome bundle runs after all normal transforms, including any `addTransform`
	// in this file. Wrapping ours the same way is the only way act on its markup.
	eleventyConfig.addPlugin((eleventyConfig) => {
		eleventyConfig.addTransform("faSymbolStyleTransform", function(content, outputPath) {
			if (outputPath && outputPath.endsWith(".html")) {
				content = content.replace(/<svg style="display: none;"><symbol/g, "<svg><symbol");
			}

			return content;
		});
	});

};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],

	// Pre-process *.html and *.md files with Nunjucks
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",

	// Basic config:
	dir: {
		input: "content",					// default: "."
		includes: "../_includes",	// default: "_includes" (`input` relative)
		data: "../_data",					// default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.
	pathPrefix: "/",
};
