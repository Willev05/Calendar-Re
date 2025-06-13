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