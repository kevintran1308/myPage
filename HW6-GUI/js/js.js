

/*
 * Function description: Validity checking (integer and range check)
 * @param None
 * @return None
 * @throws None
 */
function validate_form() {
    // get all contents from forms and store into variables
    // do not convert into int to check for integer vs float
    var row_start = (document.forms.range_input.row_start.value);
    var row_finish = (document.forms.range_input.row_end.value);
    var col_start = (document.forms.range_input.col_start.value);
    var col_finish = (document.forms.range_input.col_end.value);
    //console.log(row_start, row_finish, col_start, col_finish);

    if (checkInput(parseInt(row_start), parseInt(row_finish), parseInt(col_start), parseInt(col_finish))) {
        // first check: check to to see if min < max
        if (isInt(row_start) && isInt(row_finish) && isInt(col_start) && isInt(col_finish)) {
            // second check: check for integer vs float
            // parseInt before passing in to draw
            generateTable(parseInt(row_start), parseInt(row_finish), parseInt(col_start), parseInt(col_finish));
        }
    }
}

/*
 * Function description: This function does range check(min < max)
 * @param Min and Max values for row and column
 * @return true if text is empty and false if text is not empty
 * @throws None
 */
function checkInput(row_start, row_finish, col_start, col_finish) {
    load_content_into_element('min_length_error_message', '');
    load_content_into_element('max_length_error_message', '');
    load_content_into_element('max_width_error_message', '');
    load_content_into_element('max_width_error_message', '');

    // load empty strings into error messages
    var text = '';
        // declare empty text to store messages
    if (row_start > row_finish) {
        text = 'Starting value cannot be bigger than Ending value';
        load_content_into_element('min_length_error_message', text);
        // push text into elements
    }
    if (col_start > col_finish) {
        text = ' Ending value cannot be smaller than Starting value';
        load_content_into_element('max_width_error_message', text);
    }

    //if text == empty, means that no error -> return true and vice versa

    return (text === '')
}

/*
 * Function description: Load param into an element
 * @param Element name and content to be loaded
 * @return None
 * @throws None
 */
function load_content_into_element(element_name, content) {
    document.getElementById(element_name).innerHTML = content;
}

/*
 * Function description: Check if param is integer or not
 * @param Integer to be tested on
 * @return True if n is int and false if n is not
 * @throws None
 */
function isInt(n) {
    // http://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
    return n % 1 === 0;
}

/**
 * Function description: Draw a table and load it into table element
 * @param Min and max values for row and column
 * @return None
 * @throws None
 */
function generateTable(row_start, row_finish, col_start, col_finish) {
    var table = '<table>';
    //table variable to display
    var col_header_value = col_start; //storing data for header value
    var row_header_value = row_start;

    for (var i = col_start; i <= col_finish + 1; i++) {
        table += '<tr>'; //opening up one row of table
        for (var j = row_start; j <= row_finish + 1; j++) {
            if (i == col_start && j == row_start) {
                //corner element is empty
                table += '<td>' + '' + '</td>'; //each of these is a cell
            } else if (i == col_start) {
                //horizontal row header value
                table += "<td class ='header'>" + row_header_value++ + '</td>';
            } else if (j == row_start) {
                // vertical column header value
                table += '<td >' + col_header_value++ + '</td>';
            } else {
                // console.log("i ="+ i+"  j ="+j+"\n");
                // contents of the rest of the table
                //as name suggests, both i j is even or odd
                if (i % 2 === 0 && j % 2 === 0 || (i % 2 !== 0 && j % 2 !== 0)) {
                    table += "<td class = 'both_even_or_odd'>" + ((i - 1) * (j - 1)) + '</td>';
                } else {
                    //as name suggest, either is odd or even
                    table += "<td class = 'either_even_or_odd'>" + ((i - 1) * (j - 1)) + '</td>';
                }
            }
        }
        table += '</tr>'; // close out one row of table
    }
    table += '</table>'; // close out table tag
    // console.log(table);
    load_content_into_element('tableout', table); //push table content into element
}