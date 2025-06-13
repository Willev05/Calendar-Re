//For storage, it will work like this:
//Each key for localstorage will be a monthyear combo
//Value will be a object storing vars with key days as d#
//Each value will be a list of events
//Each event is a object with name, start, end, description
function eventCreate(e){
    //Prevent form from auto sending
    e.preventDefault();

    //Get all relevent form info
    let name = document.getElementById("eventName");
    let startTime = document.getElementById("startTime");
    let endTime = document.getElementById("endTime");
    let description = document.getElementById("description");

    //Create the base event object
    let newEvent = {
        name:name.value,
        start:startTime.value,
        description:description.value,
        end:endTime.value
    };

    //Gets the alreadyt saved events for current month. If none, makes sure to create empty object as to not access a null object
    let monthEvents = JSON.parse(localStorage.getItem(month.toString() + year));
    monthEvents = monthEvents != null ? monthEvents : {};

    //Checks to see if the day already has events
    dayEvents = monthEvents["d" + day];

    //If there are no day events, create it to make sure we are not referencing a null object
    if (dayEvents == null){
        dayEvents = [];
        monthEvents["d" + day] = dayEvents;
    }

    //Push the new event into the respective places and store it into local storage
    dayEvents.push(newEvent);

    let monthEventsString = JSON.stringify(monthEvents);

    localStorage.setItem(month.toString() + year, monthEventsString);

    //Wipe the inputs
    name.value = "";
    startTime.value = "";
    endTime.value = "";
    description.value = "";

    //Write the calendar and event screen to reflect the changes
    writeCalendar();
    writeEvents();
}