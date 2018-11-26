
$(function() {
    // Source: http://stackoverflow.com/questions/14347177/how-can-i-validate-that-the-max-field-is-greater-than-the-min-field
    //customized method for getting max value to be bigger than min value
    $.validator.addMethod("greaterThan", function(value, element, param) {
        var $max = $(param);
        if (this.settings.onfocusout) {
            //once focus is on different element,execute validation
            $max.off(".validate-greaterThan").on("blur.validate-greaterThan", function() {
                $(element).valid();
                //switch back to valid color if return valid
            });
        }
        //determine if valid number before comparison
        //this was done after value been ran thru number and float check
        //however max hasnt gotten ran thru those tests for
        //return true if min is smaller than max
        return isNaN(parseInt($max.val())) || parseInt(value) >= parseInt($max.val());
    }, "Ending value cannot be smaller than Starting value. Please try again.");

    //customized method for getting min value to be smaller than max value
    $.validator.addMethod("lessThan", function(value, element, param) {
        var $min = $(param);
        if (this.settings.onfocusout) {
            $min.off(".validate-lessThan").on("blur.validate-lessThan", function() {
                $(element).valid();
            });
        }
        //if the min input is a valid number, determine if max(value) is smaller than min
        return isNaN(parseInt($min.val())) || parseInt(value) <= parseInt($min.val());
        //console.log(value + " " + $min.val());
    }, "Starting value cannot be greater than Ending value. Please try again.");

    //customized method for detecting float number
    $.validator.addMethod("isInt", function(value, element) {
        // calling function to check for float
        return (isInt(Number(value))); //return true if is int and false if not
    }, "Float detected. Please only use integers.");

    //customized method for detecting oversized table, mainly to prevent browser freezing
    $.validator.addMethod("tooBig", function(value, element, param) {
        var $max = $(param);
        if (this.settings.onfocusout) {
            //once focus is on different element,execute validation
            $max.off(".validate-tooBig").on("blur.validate-tooBig", function() {
                $(element).valid();
                //switch back to valid color if return valid
            });
        }
        return isNaN(parseInt(value))|| isNaN(parseInt($max.val())) || (Math.abs(parseInt($max.val())) - Math.abs((parseInt(value)) > 100));
    });
    // Initialize form validation on the input form.
    // It has the name attribute "input_form"
    $("form[name='input_form']").validate({
        // Specify validation rules
        rules: {
            row_start: {
                required: true, //required input
                number: true, //has to be number
                isInt: true, // has to be integer
                lessThan: '#row_end', // min has to be smaller than max     
            },
            col_start: {
                required: true,
                number: true,
                isInt: true,
                lessThan: '#col_end',
            },
            row_end: {
                required: true,
                number: true,
                isInt: true,
                greaterThan: '#row_start', //max has to be bigger than min
                tooBig: '#row_start',
            },
            col_end: {
                required: true,
                number: true,
                isInt: true,
                greaterThan: '#col_start',
                tooBig: '#col_start',
            }
        },
        // Specify validation error messages
        messages: {
            row_start: {
                required: "Please enter the starting value for the horizontal axis.", //if no input,show this
                number: "Characters not allowed. Please enter an integer." //if detect char input, show this
            },
            row_end: {
                required: "Please enter the ending value for the horizontal axis",
                number: "Characters not allowed. Please enter an integer.",
                tooBig: "The table is too big. Please choose a smaller range."
            },
            col_start: {
                required: "Please enter the starting value for the vertical axis",
                number: "Characters not allowed. Please enter an integer."
            },
            col_end: {
                required: "Please enter the ending value for the vertical axis",
                number: "Characters not allowed. Please enter an integer.",
                tooBig: "The table is too big. Please choose a smaller range."
            },
        },
        // Once the form is valid, take action i.e draw table
        submitHandler: function(form) {
            generateTable();
        }
    });
});

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
function generateTable() {
    var row_start = Number(document.getElementById('row_start').value);
    var row_finish = Number(document.getElementById('row_end').value);
    var col_start = Number(document.getElementById('col_start').value);
    var col_finish = Number(document.getElementById('col_end').value);
    //console.log(row_start + " " + row_finish + " " + col_start + " " + col_finish);
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
    //console.log(table);
    document.getElementById('tableout').innerHTML = table; //push table content into element
}