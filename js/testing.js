document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("wipeBtn").addEventListener("click", wipeLocalStorage);
});

function wipeLocalStorage(e){
    localStorage.clear();
    drawOnNewMonth();
    drawOnNewSelectedDate();
}