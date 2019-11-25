/* Polished functions */

/**
 * Returns an ol element with li children that contain the array's strings. The order of the
 * array's strings is respected.
 * @param {String[]} array - An array containing the strings to put in the returned ol element.
 * @returns {Object} Returns an ol element with li children that contain the array's strings. The
 * order of the array's strings is respected.
 */
function arrayToOl(array) {
    return arrayToOlOrUl(array, "ol");
}

/**
 * Returns a ul element with li children that contain the array's strings. The order of the
 * array's strings is respected.
 * @param {String[]} array - An array containing the strings to put in the returned ul element.
 * @returns {Object} Returns a ul element with li children that contain the array's strings. The
 * order of the array's strings is respected.
 */
function arrayToUl(array) {
    return arrayToOlOrUl(array, "ul");
}

// reference: https://stackoverflow.com/a/11128791/12253537
function ararrayToOlOrUl(array, olOrUl) {
    var list, item, text;
    // the <ol> or <ul> element is created
    list = document.createElement(olOrUl);
    for (var i = 0; i < array.length; ++i) {
        // the <li> element is created
        item = document.createElement("li");
        // the text node containing the array[i] string is created
        text = document.createTextNode(array[i]);
        // the text node is appendend to the <li> element
        item.appendChild(text);
        // the <li> element is appended to the <ul> element
        list.appendChild(item);
    }
    return list;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min if min isn't an integer)
 * and no greater than max (or the next integer lower than max if max isn't an integer).
 * @param {Number} min - The interval's minimum value.
 * @param {Number} max - The interval's maximum value.
 * @returns {Number} A random integer between min (inclusive) and max (inclusive).
 */
// reference: https://stackoverflow.com/a/1527820/12253537
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns true if the string passed as input is a non negative integer, false otherwise.
 * Note: one or more whitespaces before and/or after the actual number are allowed, leading zeros
 *     are also allowed.
 * @param {String} str - The string that will be checked to determine if it is a non negative
 *     integer or not.
 * @returns {Boolean} Returns true if the string passed as input is a non negative integer, false
 *     otherwise.
 */
// reference: https://stackoverflow.com/a/10834843/12253537
function isNonNegativeInteger(str) {
    return /^\s*\d+\s*$/.test(str);
}

/* Unpolished functions */

/**
 * Returns the sum of the numbers in the odd positions of the array passed as input.
 * Note: an array containing numbers is expected (no controls are done to chek if the passed array
 * actually contains numbers).
 * @param {Number[]} array - An array containing numbers.
 * @returns {Number} Returns the sum of the elements in the odd positions of the array passed as
 *     input.
 */
function sumNumsInOddPosition(array) {
    var sum = 0;
    /* note that the variable i is initialized to 1, not 0, hence in the first iteration array[i]
    will be the first odd number of the array */
    for (var i = 1; i < array.length; ++i) {
        sum += array[i++];
    }
    return sum;
}