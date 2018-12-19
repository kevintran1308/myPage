$(document).ready(function() {
    make_bags();
    draw_board();
    // draw the board
    draw_tiles(letters_drawn, 7);
    // draw tiles from randomnesss
    generate_player_hand(letters_drawn, tile_class_array);
    make_return_droppable();
    make_shuffle_droppable();
    $("#recall_tiles").attr('disabled', 'disabled');
    $("#end_turn").attr('disabled', 'disabled');
    make_recall_tiles_button();
    make_new_hand_button();
    make_new_game_button();
    make_end_turn_button();
});

// Do a jQuery Ajax request for the text dictionary
$.get("files/dictionary.txt", function(txt) {
    var words = txt.split("\n");
    for (var i = 0; i < words.length; i++) {
        dict[words[i]] = true;
    }
});

function make_shuffle_droppable() {
    $("#shuffle_tile").droppable({
        drop: function(event, ui) {
            $("#tile_removed").html("");
            var draggableID = ui.draggable.attr("id"); // a,b,c,c1
            ui.draggable.detach();
            var draggableClass = ui.draggable.attr("class"); // class of a b c tile
            var droppableID = $(this).attr("id"); // dropped 
            var droppableClass = $(this).attr("class"); // col-1 row-2 start 
            // console.log(draggableID);
            var index;
            for (var i = 0; i < tile_class_array.length; i++) {
                if (draggableID == tile_class_array[i].id) {
                    index = i;
                    // remove from tile arrays
                    tile_class_array.splice(i, 1);
                }
            }
            console.log("EXCHANGE: ");
            print_all_arrays();
            if (char_list.indexOf(draggableID) != -1) {
                var idx = char_list.indexOf(draggableID);
                char_list.splice(idx, 1);
                letters_drawn.splice(idx, 1);
            }
            var match = draggableID.match(/(\w)\d*/);
            ScrabbleTiles[match[1]].number_remaining++;
            calculate_total_remaining();
            draw_tiles(letters_drawn, parseInt(1));
            generate_player_hand(letters_drawn);
            new_tile_match = char_list[char_list.length - 1].match(/(\w)\d*/);
            $("#error_message").html("Traded " + match[1] + " for " + new_tile_match[1]);
            if (tile_class_array.length == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
                $("#end_turn").attr('disabled', 'disabled');
            }
        }
    });
}

// box to return back to rack logic
/*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
function make_return_droppable() {
    $("#return_rack").droppable({
        accept: ".tile",
        tolerance: 'pointer',
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c,c1
            var draggableClass = ui.draggable.attr("class"); // class of a b c tile
            var droppableID = $(this).attr("id"); // dropped 
            var droppableClass = $(this).attr("class"); // col-1 row-2 start 
            ui.draggable.detach(); // remove from board
            var match = draggableID.match(/(\w)\d*/); // using regex just to the tile letter
            if (char_list.indexOf(draggableID) == -1) {
                // if the char list doesnt have the tile , return it back to rack
                char_list.push(draggableID);
                var new_div = $('<li id="' + draggableID + '"class="ui-state-default tile tile-' + match[1] + '"></div>');
                if (letters_drawn.indexOf(new_div) == -1) {
                    letters_drawn.push(new_div);
                }
                // supposed to put back the div too
                $("#error_message").html("Returning " + match[1] + " back");
            }
            generate_player_hand(letters_drawn); // draw the hand once again
            for (var i = 0; i < tile_class_array.length; i++) {
                if (tile_class_array[i].id === draggableID) {
                    tile_class_array.splice(i, 1);
                    tile_array.splice(i, 1);
                    // also remove from tile_array to check if tile already exist on board
                    break;
                }
            }
            // find the tiles to remove from array of object
            console.log("RETURN: ");
            //console.log(letters_drawn.length);
            // console.log(draggableID);
            // console.log("match[1] :" + match[1]);
            print_all_arrays();
            if (tile_class_array.length == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
                $("#end_turn").attr('disabled', 'disabled');
            }
        }
    });
}

var dict = {};

function findWord(word) {
    // See if it's in the dictionary
    if (dict[word]) {
        // If it is, return that word
        return word;
    }
    // Otherwise, it isn't in the dictionary.
    return "_____";
}

function check_tile(tile_class_array) {
    if (tile_class_array.length > 1) {
        for (var i = 0; i < (tile_class_array.length - 1); i++) {
            if (valid_location(tile_class_array[i], tile_class_array[(i + 1)]) == false) {
                console.log("failed check_tile");
                // update error msg
                $("#error_message").html("Tiles need to be next to each other!");
                return false;
                //return state appropriately
            }
        }
        return true;
    }
}

function valid_location(first_tile, second_tile) {
    // console.log(first_tile + " " + second_tile);
    //same row
    if (first_tile.row === second_tile.row) {
        if (Math.abs(first_tile.col - second_tile.col) < 2) {
            // check if valid location ,when diff btw location is <2 valid
            return true;
        }
        return false;
    } else if (first_tile.col === second_tile.col) {
        // or same column
        if (Math.abs(first_tile.row - second_tile.row) < 2) {
            return true;
        }
        return false;
    }
    return false;
}

function game_started(tile_class_array) {
    // check if the start tile has a tile in it
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].letter_value === "start") {
            // attempt to find the tag inside the array
            // return immediately if found
            return true;
        }
    }
    console.log("did not detect a start tile");
    //update the error msg if no start tile
    $("#error_message").html("Did not detect a start tile");
    return false;
}

function join_word(tile_class_array, separator) {
    var word_array = [];
    // sort the tiles according to row and col number
    for (var i = 0; i < tile_class_array.length; i++) {
        word_array.push(tile_class_array[i].letter);
    }
    return (word_array.join(separator));
}

function sort_tiles(tile_class_array) {
    var location_array = [];
    var vertical_word;
    var horizontal_word;
    var word_array = [];
    var new_tile_class_array = [];

    if (is_vertical(tile_class_array) && !is_horizontal(tile_class_array)) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].row);
            // push all row location
        }
        while (is_sorted(location_array) != true) {
            location_array.sort(function(a, b) { return a - b });
            // sort the array in ascending order
            // console.log(location_array);
        }
        var i = 0;
        var j = 0;
        while (new_tile_class_array.length != tile_class_array.length) {
            if (tile_class_array[i].row === location_array[j]) {
                // if the row number matches , push the element at tat id into new array
                new_tile_class_array.push(tile_class_array[i]);
                j++;
            }
            i++;
            if (i === tile_class_array.length) {
                i = 0; // reset index number
            }
        }
    } else if (is_horizontal(tile_class_array) && !is_vertical(tile_class_array)) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].col);
            // get col location
        }
        while (is_sorted(location_array) != true) {
            location_array.sort(function(a, b) { return a - b });
            // sort the array in ascending order
            // console.log(location_array);
        }
        // have an array of col number, sorted
        // want to find the index of which these col number belongs to
        var i = 0;
        var j = 0;
        while (new_tile_class_array.length != tile_class_array.length) {
            if (tile_class_array[i].col === location_array[j]) {
                new_tile_class_array.push(tile_class_array[i]);
                j++;
            }
            i++;
            if (i === tile_class_array.length) {
                i = 0;
            }
        }
    }
    console.log("SORTED: ");
    // console.log(location_array);
    // console.log("new sorted array");
    // console.log(new_tile_class_array);
    return new_tile_class_array; // return empty array if not horizontal or vertical
}


function is_sorted(arr) {
    var len = arr.length - 1;
    for (var i = 0; i < len; ++i) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

function is_vertical(tile_class_array) {
    var vertical_word = false;
    for (var i = 0; i < tile_class_array.length - 1; i++) {
        // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
        if (tile_class_array[i].col === tile_class_array[i + 1].col) {
            vertical_word = true;
            // if all same row, its a horizontal_word
        }
    }
    return vertical_word;
}

function is_horizontal(tile_class_array) {
    var horizontal_word = false;
    for (var i = 0; i < tile_class_array.length - 1; i++) {
        // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
        if (tile_class_array[i].row === tile_class_array[i + 1].row) {
            horizontal_word = true;
            // if all same row, its a horizontal_word
        }
    }
    return horizontal_word;
}

function print_all_arrays() {
    console.log(tile_array);
    console.log(tile_class_array);
    console.log(char_list);
    console.log(letters_drawn);
}