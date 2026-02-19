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
			"./content/img/": "/img" // The entire img folder and all contents
		});

	/**
	 * Watch Targets
	 * Run Eleventy when these files change
	 * See https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
	 * */

	eleventyConfig.addWatchTarget("public/css/**/*.css");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}"); // For the image pipeline

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
			base: "https://www.pretz.dev/",
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

	// Filter to convert the article JSON data to actual usable HTML
	eleventyConfig.addFilter("lexicalToHTML", function(content) {
		if (!content || !content.root) return "";

		return convertLexicalToHTML(content.root);
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
	// Used for the copyright year in the footer
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	// When the site was last built
	// Currently not used
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	/**
	 * Transforms
	 * The opposite of the preprocessor - transforms modify the output of a file
	 * See https://www.11ty.dev/docs/transforms/
	 * */

	// Wrap tables in a <div> that allows for scrollable overflow, preventing tables from getting cut off
	eleventyConfig.addTransform("wrapTables", function(content) {
		// Only run this transform on HTML output
		if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
			const regex = /<table\b[\s\S]*?<\/table>/gi;
			
			// Replace all <table> elements with the wrapped version
			const wrappedContent = content.replace(regex, (match) => {
				// tabindex="0" makes this div focusable, which is necessary if it has scroll
				// See Accessibility under https://piccalil.li/blog/styling-tables-the-modern-css-way/
				return `<div class="table-wrapper" tabindex="0">${match}</div>`;
			});

			return wrappedContent;
		}

		return content;
	});

	// Add phone and email icons to a elements with a tel or mailto link
	// This ONLY works because the icons are in use in the footer, otherwise we'd
	// need to set this to run pre-fontawesome plugin and use the <i></i> version.
	eleventyConfig.addTransform("prependLinksWithIcon", function(content, outputPath) {
		// Only run this transform on HTML output
		if (outputPath && outputPath.endsWith(".html")) {
			const phoneSVG = `<svg class="icon-svg" aria-hidden="true" focusable="false" role="img"><use href="#fas-fa-phone" xlink:href="#fas-fa-phone"></use></svg>`;
			const mailSVG = `<svg class="icon-svg" aria-hidden="true" focusable="false" role="img"><use href="#fas-fa-at" xlink:href="#fas-fa-at"></use></svg>`;
			
			// Regex to find <a> tags where the href starts with 'tel:' AND does NOT contain the class 'data-no-icon'.
			// 1. (tel:.*?"[^>]*?): Matches the href="tel:..." part, including any attributes before the closing >
			// 2. (?!.*data-no-icon): NEGATIVE LOOKAHEAD to ensure 'data-no-icon' is NOT anywhere in the <a> tag's attributes
			// 3. (.*?) captures the inner content of the <a> tag (the phone number text)
			const telLinkRegex = /(<a\s(?!.*data-no-icon)[^>]*?href=['"]tel:.*?"[^>]*?>)(.*?)(<\/a>)/gim;
			const mailLinkRegex = /(<a\s(?!.*data-no-icon)[^>]*?href=['"]mailto:.*?"[^>]*?>)(.*?)(<\/a>)/gim;

			content = content.replace(telLinkRegex, (match, openTag, innerContent, closeTag) => {
				// Return the new structure: <a href="tel:XXX-XXX-XXXX"> + SVG + Text Content + </a>
				return `${openTag}${phoneSVG} ${innerContent}${closeTag}`;
			});

			content = content.replace(mailLinkRegex, (match, openTag, innerContent, closeTag) => {
				// Return the new structure: <a href="mailto/tel:"> + SVG + Text Content + </a>
				return `${openTag}${mailSVG} ${innerContent}${closeTag}`;
			});
		}

		return content;
	});
	
	eleventyConfig.addTransform("html-anchor-transform", function(content, outputPath) {
		// Only run this transform for HTML output
		if (outputPath && outputPath.endsWith(".html")) {
			// (<h([234])[^>]*id=['"]([^'"]+)['"][^>]*>): Captures the opening tag (Group 1), heading level (Group 2), and ID value (Group 3).
			// (.*?): Captures the content of the heading (Group 4).
			// (<\/h\2>): Captures the closing tag, matching the level (Group 5).
			const regex = /(<h([234])[^>]*id=['"]([^'"]+)['"][^>]*>)(.*?)(<\/h\2>)/gsi;
			const faLinkSymbol = '<svg class="icon-svg"><use href="#fas-fa-link" xlink:href="#fas-fa-link"></use></svg>'
			
			content = content.replace(regex, (
				match,          // Full match string
				openingTag,     // Group 1: <h2 id="x" ...>
				headingLevel,   // Group 2: 2, 3, or 4. Unused here but used in the original string, so we have to have it here.
				idValue,        // Group 3: The actual ID string
				contentBody,    // Group 4: The content inside the heading
				closingTag      // Group 5: </h2>, </h3>, or </h4>
			) => {
				// If the header content is a link, return the original match without adding an anchor.
				const isLinkHeader = contentBody.trim().toLowerCase().startsWith('<a');
				if (isLinkHeader) return match;

				// Construct the anchor link using the captured ID value
				const anchorLink = `<a href="#${idValue}" aria-hidden="true" class="header-anchor">${faLinkSymbol}</a>`;
				
				// This places an anchor link after the heading's content.
				return openingTag + contentBody + " " + anchorLink + closingTag;
			});
		}

		return content;
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
