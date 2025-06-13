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

//Gets absolute height by adding margin. Returns a float !! border-box model is already in use !!
function getAbsoluteWidthFromElement(element){
    let elementStyle = getComputedStyle(element);

    //Gets both the border-box values and then margin
    let elementWidthFromStyle = parseFloat(elementStyle.width);
    let elementMarginFromStyle = parseFloat(elementStyle.marginLeft) + parseFloat(elementStyle.marginRight);

    let elementAbsoluteWidth = elementWidthFromStyle + elementMarginFromStyle;
    
    return elementAbsoluteWidth;
}

//Size element 1 to size of element 2. Uses margins to make it work, adds equal to both sides.
function resizeElementToOthersSize(element1, element2, matchContentStart = false){
    let element2Width = getAbsoluteWidthFromElement(element2);
    let element1Width = getAbsoluteWidthFromElement(element1);
    let element1Style = getComputedStyle(element1);

    //Gets the difference in widths
    let elementWidthDiffs = element2Width - element1Width;

    if (matchContentStart){
        let element2Style = getComputedStyle(element2);

        elementWidthDiffs = elementWidthDiffs + parseFloat(element1Style.marginLeft) - parseFloat(element2Style.marginLeft);

        element1.style.marginLeft = element2Style.marginLeft;
        element1.style.marginRight = parseFloat(element1Style.marginRight) + elementWidthDiffs + "px";
    }
    else {
        let paddingToAdd = elementWidthDiffs / 2;

        element1.style.marginLeft = parseFloat(element1Style.marginLeft) + paddingToAdd + "px";
        element1.style.marginRight = parseFloat(element1Style.marginRight) + paddingToAdd + "px";
    }

    

}

//Returns days ina  given month (0 index)
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}