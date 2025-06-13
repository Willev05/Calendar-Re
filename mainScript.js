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
    let form = document.getElementById("appointmentCreatorForm");
    form.addEventListener("submit", appointmentCreate);

});

//Triggered when next month button is clicked
function changeNextMonth(e){
    //Makes a check to see if month will overflow into next year, updates values and rewrite elements
    if (calMonth + 1 > 11){
        calMonth = 0;
        calYear += 1;
    }
    else{
        calMonth += 1;
    }

    drawOnNewMonth();
}

//Triggered when previous month button is clicked
function changePrevMonth(e){
    //Makes a check to see if month will overflow into previous year, updates values and rewrite elements
    if (calMonth - 1 < 0){
        calMonth = 11;
        calYear -= 1;
    }
    else{
        calMonth -= 1;
    }

    drawOnNewMonth();
}

//Updates the date when a cell is clicked
function cellClicked(e){
    //Get all relevgent elements and data
    let cell = e.currentTarget;
    let dateS = cell.firstElementChild.textContent;
    let date = parseInt(dateS);

    //Makes sure date is valid and then updates date to calendar year, month and selected day
    if (date > 0){
        day = date;
        month = calMonth;
        year = calYear;
        drawOnNewSelectedDate();
    }
}

//For storage, it will work like this:
//Each key for localstorage will be a monthyear combo
//Value will be a object storing vars with key days as d#
//Each value will be a list of appointments
//Each appointment is a object with name, start, end, description
function appointmentCreate(e){
    //Prevent form from auto sending
    e.preventDefault();

    //Get all relevent form info
    let name = document.getElementById("appointmentName");
    let startTime = document.getElementById("startTime");
    let description = document.getElementById("description");

    //Create the base appointment object
    let newAppointment = {
        name:name.value,
        start:startTime.value,
        description:description.value
    };

    //Gets the alreadyt saved appointments for current month. If none, makes sure to create empty object as to not access a null object
    let monthAppointments = JSON.parse(localStorage.getItem(month.toString() + year));
    monthAppointments = monthAppointments != null ? monthAppointments : {};

    //Checks to see if the day already has appointments
    dayAppointments = monthAppointments["d" + day];

    //If there are no day appointments, create it to make sure we are not referencing a null object
    if (dayAppointments == null){
        dayAppointments = [];
        monthAppointments["d" + day] = dayAppointments;
    }

    //Push the new appointment into the respective places and store it into local storage
    dayAppointments.push(newAppointment);

    let monthAppointmentsString = JSON.stringify(monthAppointments);

    localStorage.setItem(month.toString() + year, monthAppointmentsString);

    //Wipe the inputs
    name.value = "";
    startTime.value = "";
    description.value = "";

    //Write the calendar and appointment screen to reflect the changes
    writeCalendar();
    writeAppointments();
}