//Helper functions

//Gets absolute height by adding margin. Returns a float !! border-box model is already in use !!
function getAbsoluteHeightFromElement(element){
    let elementStyle = getComputedStyle(element);

    //Gets both the border-box values and then margin
    let elementHeightFromStyle = parseFloat(elementStyle.height);
    let elementMarginFromStyle = parseFloat(elementStyle.marginTop) + parseFloat(elementStyle.marginBottom);

    let elementAbsoluteHeight = elementHeightFromStyle + elementMarginFromStyle;
    
    return elementAbsoluteHeight;
}

//Returns days ina  given month (0 index)
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}