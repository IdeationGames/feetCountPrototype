let instance;

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.carousel');
   
    instance = M.Carousel.init(elems, {
        fullWidth: true,
        indicators: true
    });
});



