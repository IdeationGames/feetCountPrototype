let instance;

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.carousel');
   
    window.instance = M.Carousel.init(
        elems, {
        fullWidth: true,
        duration: 10,
        indicators: true
    });
    
    elems.forEach(function (ele, key, arr)
    {
        ele.style.height = "200px";
    });
});



