// Note: this script is not necessary for the functionality of the site.
// Highlights the "On This Page" link for whichever section is currently in view.

(function() {
	const links = document.querySelectorAll("#page-anchor-list a");
	if (links.length === 0) return;

	const sections = Array.from(links)
		.map(link => ({
			item: link.parentElement,
			target: document.getElementById(link.getAttribute("href").slice(1))
		}))
		.filter(section => section.target);

	if (sections.length === 0) return;

	// Match the offset used for scroll-padding-top/anchor-link scrolling so the
	// highlighted section changes right as it reaches its resting scroll position.
	const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
	// Anchor-link scrolling settles a section's top at ~offset, not 0, and can land
	// a fraction of a pixel past that; give it a little slack to avoid missing it.
	const slack = 2;

	function setActiveSection() {
		let current = sections[0];

		for (const section of sections) {
			if (section.target.getBoundingClientRect().top - offset <= slack) {
				current = section;
			}
		}

		for (const section of sections) {
			section.item.classList.toggle("active-tab", section === current);
		}
	}

	document.addEventListener("scroll", setActiveSection, { passive: true });
	window.addEventListener("resize", setActiveSection);
	setActiveSection();
})();
