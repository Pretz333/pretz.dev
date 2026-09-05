// Note: this script is not necessary for the functionality of the site. I purposely built the
// entire carousel first, then wrote this script to add enhancements to the existing experience

// This script handles height-syncing, since that requires the
// browser's actual rendered layout (can't be pre-computed).

(function() {
	// Get all carousels on the page
	let carousels = document.querySelectorAll(".carousel");

	for(let i=0; i<carousels.length; i++) {
		let carousel = carousels[i];
		let slides = carousel.children;

		// Only carousels with mutiple slides can have a height mismatch
		if(slides.length > 1) {
			// Flexbox's default stretch will size every slide (i.e. the whole carousel)
			// to the tallest slide even when a shorter slide is the only one in view.
			
			// Fix this by giving the carousel an explicit height matching the height of
			// the current slide instead, re-syncing as the user scrolls between slides.
			let syncHeight = function() {
				let index = Math.round(carousel.scrollLeft / carousel.clientWidth);
				let current = slides[index] || slides[0];
				// Right at page load, a slide can briefly measure as 0px in height
				// which would collapse the carousel. Just leave the height as-is
				// until a later call (scroll/resize/the load event) gets a real value.
				if (current.offsetHeight > 0) {
					// .carousel's own horizontal scrollbar eats into its available
					// content height, so sizing to exactly the slide's height would crop
					// off that much from the bottom. offsetHeight - clientHeight measures
					// whatever that scrollbar's actual current thickness is (0 if hidden).
					let scrollbarThickness = carousel.offsetHeight - carousel.clientHeight;
					carousel.style.height = (current.offsetHeight + scrollbarThickness) + "px";
				}
			};

			carousel.addEventListener("scroll", syncHeight, { passive: true });
			window.addEventListener("resize", syncHeight);
			window.addEventListener("load", syncHeight);
			syncHeight();
		}
	};
})();
