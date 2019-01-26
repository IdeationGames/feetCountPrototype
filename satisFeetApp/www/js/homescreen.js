console.log("homescreen.js");

function carouselModifications(){
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
}
function addClickListener() {
    document.getElementById("run").addEventListener("click",startTracking.bind(this));
	document.getElementById("current-run").addEventListener("click",stopTracking.bind(this));
}
carouselModifications();
addClickListener();