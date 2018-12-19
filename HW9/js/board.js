
function draw_board() {
    var cell_value = [
        4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4,
        0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0,
        0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0,
        1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1,
        0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
        0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0,
        0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        4, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 4,
        0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0,
        0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
        1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1,
        0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0,
        0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0,
        4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4
    ];
    // each cell value of the table
    var table = '<table>'; // opening up table tag
    table += '<tr>';
    var row_counter = 0;
    var row_num = 1;
    var col_num = 1;
    for (var i = 0; i < cell_value.length; i++) {
        switch (cell_value[i]) {
            case 5:
                // if meet of these value, will color table differently
                table += "<td class = 'start row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 4:
                table += "<td class = 'triple_word row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 3:
                table += "<td class = 'double_word row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 2:
                table += "<td class = 'triple_letter row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 1:
                table += "<td class = 'double_letter row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 0:
                table += "<td class = 'normal_row row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
        }
        if (row_counter === 15) {
            // 14 td in a row
            // onto next row
            row_counter = 0;
            row_num++;
        }
        if (col_num === 16) {
            // 15 col in the game
            // reset col num to begin
            col_num = 1;
        }
    }
    table += '</tr>'; // close out one row of table
    table += '</table>'; // close out table tag
    document.getElementById('tableout').innerHTML = table; // push table content into element
    make_td_droppable();
}

var start_tile_class = "start row-8 col-8 ui-droppable";
// droppable logic for each cell
function make_td_droppable() {
    $("td").droppable({
        tolerance: "pointer",
        accept: ".tile",
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c
            var draggableClass = ui.draggable.attr("class"); // class of a b c tiles
            var droppableID = $(this).attr("id"); // id of the tile (none yet)
            var droppableClass = $(this).attr("class"); // class of the tile (double_word tile tile-a col-n row-n)
            var $this = $(this);
            $("#end_turn").removeAttr('disabled'); // re-enable end turn button ONLY when a new tile has been added
            $("#recall_tiles").removeAttr('disabled'); // a tile is on the board, can return em
            $("#tile_removed").html(""); // remove msg on new action
            // console.log("match[1]" + match[1]);
            var match;
            //  console.log("length of char list after a tile has been moved" + char_list.length);
            if ($(this).children(".tile").length == 0) {
                ui.draggable.detach().appendTo($(this));
                for (var i = 0; i < char_list.length; i++) {
                    if (draggableID == char_list[i]) {
                        char_list.splice(i, 1);
                        letters_drawn.splice(i, 1);
                    }
                } // remove tiles from hand
                generate_player_hand(letters_drawn); // drawn hand again

                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $this,
                    using: function(pos) {
                        $(this).animate(pos, "fast", "linear");
                    }
                }); // animate tiles moving into position!
                if (tile_array.indexOf(draggableID) === -1) {
                    // only accept unique tiles
                    // using regex to get relevant data from id and class
                    match = draggableClass.match(/.*\stile-(\w).*/); // just grabbing the letter (tile-w) -> w
                    var obj = {}; // declaring object to store relevant data
                    obj.letter = match[1];
                    obj.id = draggableID;
                    match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
                    obj.row = parseInt(match[2]); // field 2
                    obj.col = parseInt(match[3]); // field 3
                    obj.letter_value = match[1]; // field 1
                    obj.value = parseInt(ScrabbleTiles[obj.letter].value);
                    tile_array.push(draggableID); // get id of tile(a,b,c)
                    tile_class_array.push(obj); // put the obj into array to store 
                    //for (var i = 0; i < tile_class_array.length; i++) {
                    $("#error_message").html("Tile " + obj.letter + " added");
                    //}
                    console.log("ADDING NEW TILE: " + draggableID);
                    print_all_arrays();
                } else {
                    // tile is already in, but dropped to a different location
                    // console.log("BEFORE UPDATE");
                    // console.log(tile_class_array);
                    update_location_of_tiles(droppableClass, draggableID, tile_class_array);
                    console.log("UPDATING TILE: " + draggableID);
                    print_all_arrays();
                    match = draggableClass.match(/.*\stile-(\w).*/); // just grabbing the letter (tile-w) -> w
                    $("#error_message").html("Tile " + match[1] + " relocated");
                }
                // $("#" + draggableID).droppable('disable');
            } else {
                console.log("cell is already full");
                // already has a tile in it
                ui.draggable.draggable('option', 'revert', true);
                // return tile back to where it came from
            }
        },
    });
}



// if tile already on board, update new location
function update_location_of_tiles(droppableClass, draggableID, tile_class_array) {
    var index;
    // get relevant data using regex
    // console.log("droppableClass from update_location_of_tiles");
    // console.log(droppableClass);
    var match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].id == draggableID) {
            // find the right obj, and update info
            tile_class_array[i].row = parseInt(match[2]);
            tile_class_array[i].col = parseInt(match[3]);
            tile_class_array[i].letter_value = match[1];
        }
    }
}

function display_word_and_add_score(tile_class_array, score) {
    var word = join_word(tile_class_array, "");
    //console.log("found " + word);
    if (tile_class_array.length > 0) {
        var new_score = calculate_score(tile_class_array);
        score += new_score;
    }
    // calculate score and update score
    $("#score").html("Score: " + score);
    $("#error_message").html("Found: \n" + word);
    $("#tile_removed").html("Tile(s) " + join_word(tile_class_array, ", ") + "<br/>" + " permanently removed." + "<br/>" + "Added " + parseInt(tile_class_array.length) + " tiles");
    number_of_round++;
    // add round number
    completed_word.push(word);
    // add word to completed word list
    // get total number of tile up to 7 again
    for (var i = 0; i < tile_class_array.length; i++) {
        permanent_tile_array.push(tile_class_array[i]);
        // storing all placed tiles 
        // transfer all the pending tiles on to a permanent array
    }
    // console.log("DISPLAYING SCORE");
    // print_all_arrays();
    // disabling the button after sucessfully found the word in the dictionary
    return score;
}

function make_tiles_and_cell_permanent(tile_array) {
    // console.log("MAKING TILES PERM:");
    // print_all_arrays();
    for (var i = 0; i < tile_array.length; i++) {
        $("#" + tile_array[i]).draggable('disable');
    }

}