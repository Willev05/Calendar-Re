
function initiateCalendar(){
    let mainTable = document.getElementById("mainTable").firstElementChild;

    //Creates the basic semantic table
    for (let i = 0; i < 6; i++){
        let newRow = document.createElement("tr");
        newRow.classList.add("calendarRow");

        for (let j = 0; j < 7; j++){
            //Create the cell, container inside the cell, the p for the date and a div to hold event for the day
            let newCell = document.createElement("td");
            let cellContainer = document.createElement("div");
            let dateHolder = document.createElement("p");
            let eventHolder = document.createElement("div");

            //Center date and add a custom class to each cell container
            cellContainer.classList.add("cellContainer")
            dateHolder.classList.add("center");

            //Append each node to their proper parents
            newCell.appendChild(cellContainer);
            cellContainer.appendChild(dateHolder);
            cellContainer.appendChild(eventHolder);

            //Make cells responsive for date selection and add to row
            newCell.addEventListener("click", cellClicked);
            newRow.appendChild(newCell);
        }

        //Adds completed row to main table
        mainTable.appendChild(newRow)
    }

}

//Calls functions that will need to update if a new calendar month needs to be displayed
function drawOnNewMonth(){
    writeCalendar();
    updateMonthDisplay();
}

//Calls functions that will need to update if a new date is selected
function drawOnNewSelectedDate(){
    updateDateDisplay();
    updateMonthDisplay();
    writeCalendar();
    writeAppointments();
}

//Calls functions to reformat window to fit all elements
function resizeElements(e){
    //Variable is used to make sure table stays at proper size
    let shouldBeTableSize = resizeCalendarTable();
    resizeCalendar();
    resizeCalendarCells(shouldBeTableSize);
    resizeAppointmentView();
    writeCalendar();
}

//Resizes the calendar table vertically
function resizeCalendarTable(){
    //Get all required elements
    let calendar = document.getElementById("calendar");
    let mainTable = document.getElementById("mainTable");
    let siblings = document.querySelectorAll("#calendar > *")

    //Set some heights for later use
    let calendarTotalHeight = getAbsoluteHeightFromElement(calendar); 
    let totalSiblingHeight = 0;

    for (sibling of siblings){
        //Exclude table as is going to be resized later
        if (sibling.id == "mainTable"){
            continue;
        }

        
        totalSiblingHeight += getAbsoluteHeightFromElement(sibling);
    }

    let calendarRemainingSize = calendarTotalHeight - totalSiblingHeight;

    //We only want part of it as to not stick to corners of screen
    let calendarWantedSize = calendarRemainingSize * 0.95;

    mainTable.style.height = calendarWantedSize + "px";

    return calendarWantedSize;
}

//Month display is the element on top of the calendar displaying calendar month. Gets called every time calendar year/month is modified
function updateMonthDisplay(){
    //Gets the header and writes the month + year
    let header = document.getElementById("monthHeader");
    let monthString = monthStrings[calMonth];
    let yearString = calYear.toString();

    header.textContent = monthString + " " + yearString;
}

//Date display is the element on top of the events on the left panel. Gets called every time selected date is modified
function updateDateDisplay(){
    //Gets the header and writes the day + month + year
    let header = document.getElementById("selectedDate");
    let dayString = day.toString();
    let monthString = monthStrings[month];
    let yearString = year.toString();

    header.textContent = dayString + " " + monthString + " " + yearString;
}

//Resize the calendar panel horizontally
function resizeCalendar(){
    //Get the two main divs
    let sidePanel = document.getElementById("sidePanel");
    let calendar = document.getElementById("calendar");
    let parent = document.getElementById("pageParent");
    
    //Gets the width of side panel and the total screen width
    let sidePanelWidth = parseFloat(getComputedStyle(sidePanel).width);
    let totalWidth = parseFloat(getComputedStyle(parent).width);
    
    //Set the calendar panel to be as wide as the remaining space
    let remainingWidth = totalWidth - sidePanelWidth;

    calendar.style.width = remainingWidth + "px";
}

//Resize the appointment display section of the side panel vertically
function resizeAppointmentView(){
    //Get all required elements
    let appointmentForm = document.getElementById("appointmentCreator");
    let appointmentViewer = document.getElementById("appointmentShow");
    let selectedDate = document.getElementById("selectedDate");
    let parent = document.getElementById("sidePanel");

    //Get the height of every other element
    let appointmentFormHeight = getAbsoluteHeightFromElement(appointmentForm);
    let selectedDateHeight = getAbsoluteHeightFromElement(selectedDate);
    let totalHeight = getAbsoluteHeightFromElement(parent);

    //Set the appointment display section to the remaining height
    let remainingHeight = totalHeight - appointmentFormHeight - selectedDateHeight;

    appointmentViewer.style.height = remainingHeight + "px";
}

//Resize the calendar cells to make the uniform vertically
function resizeCalendarCells(size){
    //Get the cells, loop through them and set the cell container to be desired height. The numbers are related to border. Size is table total height, including all borders.
    let cells = document.querySelectorAll("#mainTable td");

    for (cell of cells){
        let cellContainer = cell.firstElementChild;
        cellContainer.style.height = (size - 20) / 6 - 8 + "px";
    }
}

//Write the calendar dates and events within the calendar
function writeCalendar(){
    //sets variables to represent total dayts in the month, the current day itteration and the day of the week to start on (0 index)
    let totalDays = daysInMonth(calMonth, calYear);
    let currentDay = 1;
    let dayOfTheWeekToStart = new Date(calYear, calMonth, 1).getDay();

    //Gets all the rows and pulls the monthly appointments from storage
    let calendarRows = document.querySelectorAll("#mainTable tr[class=\"calendarRow\"]");
    let monthlyAppointments = JSON.parse(localStorage.getItem(calMonth.toString() + calYear));

    //Adds a check to make sure no null objects get accessed
    monthlyAppointments = monthlyAppointments != null ? monthlyAppointments : {};

    //Goes through each row, cells run through keep track of how many cells have been itterated
    let cellsRunThrough = 0;
    for (row of calendarRows){

        //Gets all cells for specific
        let cells = row.children;
        for (cell of cells){
            //Gets the cell container, date container, events container and the day appointments for current day
            cell = cell.firstElementChild;
            let date = cell.firstElementChild;
            let events = cell.lastElementChild;
            let dayAppointments = monthlyAppointments["d" + currentDay];

            ////Adds a check to make sure no null objects get accessed
            dayAppointments = dayAppointments != null ? dayAppointments : [];

            //Remove any previous date or events for the cell
            events.textContent = "";
            date.textContent = "";
            date.classList.remove("today");
            cell.classList.remove("selected");

            //Increments the cells that have been itterated
            cellsRunThrough++;

            //Skips the rest of the itteration if the number of cells run through is smaller than the day to start. Makes sure days display at the right spots
            if (cellsRunThrough < dayOfTheWeekToStart + 1){
                continue;
            }

            //Checks to see if all the days have been displayed
            if (currentDay <= totalDays){

                //These two checks check to see if the date is today, if so add a class and if the date is selected, add another class
                if (todayDay == currentDay && todayMonth == calMonth && todayYear == calYear){
                    date.classList.add("today");
                }
                if (day == currentDay && month == calMonth && year == calYear){
                    cell.classList.add("selected");
                }

                date.textContent = currentDay.toString();
                
                //Write appointments on the small card
                //Take how many events are remaining, we need to figure out how many can fit on the screen
                let amOfEvents = dayAppointments.length;
                let remainingHeight = parseFloat(getComputedStyle(cell).height) - 50;
                for (let i = 0; i < dayAppointments.length; i++){
                    let text = "";

                    //If there is no more space to display an event on the small card, display how many are supposed to be left and end the loop
                    if (remainingHeight - 26 < 26){
                        text = "+" + amOfEvents + " more";
                        i = dayAppointments.length;
                    }
                    else {
                        text = dayAppointments[i]["name"];
                    }

                    //Adds the event title to the calendar through a p element
                    let newEvent = document.createElement("p");
                    newEvent.textContent = text;
                    newEvent.classList.add("calendarEvent");
                    newEvent.classList.add("center");
                    events.appendChild(newEvent);

                    //Makes sure to update remaining height as to be able to fit events proprely
                    remainingHeight -= 26;
                    amOfEvents--;
                }
            }
            currentDay++;
        }
    }
}

//Write the appointments on the left side of the screen
function writeAppointments(){
    //Gets the daily appointments from storage
    let monthlyAppointments = JSON.parse(localStorage.getItem(month.toString() + year));
    monthlyAppointments = monthlyAppointments != null ? monthlyAppointments : {};

    let dateAppointments = monthlyAppointments["d" + day];
    dateAppointments = dateAppointments != null ? dateAppointments : [];

    //Wipe currently displaying appointments
    let appointmentContainer = document.getElementById("appointmentShow");
    appointmentContainer.textContent = "";


    if (dateAppointments.length == 0){
        //Make a container to contain info about the day and how to make appointmnent
        let newContainer = document.createElement("div");
        let appointmentDesc = document.createElement("p");

        //write the p that will contain text
        appointmentDesc.textContent = "You have no appointments on this date! To make an appointment, select a date on the calendar and make fill the form."

        //Add to new div
        newContainer.appendChild(appointmentDesc);

        //Add to the main div
        appointmentContainer.appendChild(newContainer);
    }

    for (appointment of dateAppointments){
        //All appointment details are part of another general div
        let newContainer = document.createElement("div");
        let appointmentTitle = document.createElement("h3");
        let appointmentTimes = document.createElement("p");
        let appointmentDesc = document.createElement("p");

        //Only want all elements to be centered
        appointmentTitle.classList.add("center");
        appointmentTimes.classList.add("center");
        appointmentDesc.classList.add("center");
        
        //Inputs the stored appointment into the elements
        appointmentTitle.textContent = appointment.name;
        appointmentTimes.textContent = appointment.start;
        appointmentDesc.textContent = appointment.description;

        //Adds them to new div and then finnaly appends it to the main container
        newContainer.appendChild(appointmentTitle);
        newContainer.appendChild(appointmentTimes);
        newContainer.appendChild(appointmentDesc);

        appointmentContainer.appendChild(newContainer);
    }
}