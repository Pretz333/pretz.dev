// Note: this script is not necessary for the functionality of the site.
// I purposely built the entire carousel first, then wrote this script to add enhancements to the existing experience

(function() {
	// Get all carousels on the page
	let carousels = document.querySelectorAll(".carousel");

	// Add buttons for each slide
	for(let i=0; i<carousels.length; i++) {
		let carousel = carousels[i];
		let slides = carousel.children;

		// Only add buttons for carousels with more than 1 slide
		if(slides.length > 1) {
			// make a div that holds the buttons with the DOM API, not innerHTML +=
			// since that would re-parse and replace the carousel itself
			let buttonHolder = document.createElement("div");
			buttonHolder.className = "carousel-button-holder";

			for(let j=0; j<slides.length; j++) {
				// add id for linking
				const id = "carou_" + i + "_slide_" + j;
				slides[j].setAttribute('id', id);

				let button = document.createElement("a");
				button.className = "carousel-button";
				button.href = "#" + id;
				button.textContent = " " + (j+1);
				buttonHolder.appendChild(button);
			}

			// insert the button holder onto the page after the carousel
			carousel.parentElement.appendChild(buttonHolder);

			// Slides can differ in natural height (e.g. a tall portrait mobile
			// screenshot next to a short landscape video). Flexbox's default stretch
			// would otherwise size every slide, and so the whole carousel, to the
			// tallest one even when a shorter slide is the only one in view. Give the
			// carousel an explicit height matching just the current slide instead,
			// re-syncing as the user scrolls between slides.
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
