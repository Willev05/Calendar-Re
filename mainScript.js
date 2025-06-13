const monthStrings = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Holds selected date
var day;
var month;
var year;

//Holds today's date for blue number highlight
var todayDay;
var todayMonth;
var todayYear;

//Holds currently displayed calendar month and year
var calMonth;
var calYear;

//Stariting point of the document, everything gets done when the DOM is loaded
document.addEventListener("DOMContentLoaded", function(){
    initiateCalendar();

    //Get the date and write at required places
    const date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    todayDay = day;
    todayMonth = month;
    todayYear = year;

    calMonth = month;
    calYear = year;

    //Calls the new date which draws all elements linked to dates
    drawOnNewSelectedDate();

    //Handles all height, width for the window. Triggered on resize and on launch
    window.addEventListener("resize", resizeElements);
    resizeElements();
    
    //Add function to the month buttons
    let nextMonth = document.getElementById("nextMonth");
    let prevMonth = document.getElementById("prevMonth");

    nextMonth.addEventListener("click", changeNextMonth);
    prevMonth.addEventListener("click", changePrevMonth);

    //Add functionality to the form
    let form = document.getElementById("eventCreatorForm");
    form.addEventListener("submit", eventCreate);

});

