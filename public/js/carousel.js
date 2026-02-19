// Note: this script is not necessary for the functionality of the site.
// I purposely built the entire carousel first, then wrote this script to add enhancements to the existing experience

(function() {
  // Get all carousels on the page
  let carousels = document.querySelectorAll(".carousel");

  // Add buttons for each slide
  for(let i=0; i<carousels.length; i++) {
    let slides = carousels[i].children;

    // Only add buttons for carousels with more than 1 slide
    if(slides.length > 1) {
      // make a div that holds the buttons
      let buttonHolderHTML = '<div class="carousel-button-holder">';

      for(let j=0; j<slides.length; j++) {
        // add id for linking
        const id = "carou_" + i + "_slide_" + j;
        slides[j].setAttribute('id', id);
        
        // add button to the buttonHTML
        buttonHolderHTML += '\n<a class="carousel-button" href="#' + id + '"> ' + (j+1) + '</a>';
      }

      buttonHolderHTML += "\n</div>";

      // insert the button html onto the page after at the end of the carousel
      carousels[i].parentElement.innerHTML += buttonHolderHTML;
    }
  };
})();