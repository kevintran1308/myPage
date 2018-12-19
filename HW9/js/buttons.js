function make_recall_tiles_button() {
    $("#recall_tiles").click(function() {
        console.log("RECALL TILES: ");
        // moving tiles from board back to rack
        if (char_list.length < 8 && letters_drawn.length < 8) {
            $("#error_message").html("Putting " + tile_class_array.length + " tiles back.");
            for (var i = 0; i < tile_class_array.length; i++) {
                if (char_list.indexOf(tile_class_array[i].id) == -1) {
                    // only put back when unique
                    document.getElementById(tile_class_array[i].id).remove();
                    char_list.push(tile_class_array[i].id);
                    // put id back
                    var new_div = $('<li id="' + tile_class_array[i].id + '"class="ui-state-default tile tile-' + tile_class_array[i].letter + '"></div>');
                    if (letters_drawn.indexOf(new_div) == -1) {
                        // only put back when unique
                        letters_drawn.push(new_div);
                    }
                }
            }

            // document.getElementById("permanent")
            if (char_list.length == 7) {
                tile_class_array.splice(0);
                tile_array.splice(0);
            } else {
                console.log('there are tiles on the board still');
            }
        }
        print_all_arrays();
        generate_player_hand(letters_drawn);
        $("#recall_tiles").attr('disabled', 'disabled');
        $("#end_turn").attr('disabled', 'disabled');
        // draw hands again
    });
}

function make_new_hand_button() {
    $("#new_hand").click(function() {
        var current_no_of_tiles = char_list.length; // only exchange the current number of tiles on hand
        console.log("NEW HAND");
        for (var i = 0; i < current_no_of_tiles; i++) {
            var match = char_list[i].match(/(\w)\d*/);
            // console.log(char_list[i]);
            // console.log("Putting back: " + match[1]);
            ScrabbleTiles[match[1]].number_remaining++;
            // put the tiles back to the bag
        }
        calculate_total_remaining();
        letters_drawn.splice(0); // empty out all arrays that contains relevant data abt player hand
        char_list.splice(0);
        draw_tiles(letters_drawn, current_no_of_tiles); // only draw the no of tiles on hand
        generate_player_hand(letters_drawn); // redraw rack
        $("#error_message").html("Exchanged " + current_no_of_tiles + " tiles");
        $("#tile_removed").html("");
    });
}

function make_new_game_button() {
    $("#new_game").click(function() {
        // this funciton resets everything back to starting state
        make_bags();
        draw_board(); // drawing board again
        letters_drawn.splice(0); // reset rack arrays 
        tile_class_array.splice(0); // reset tile obj array
        char_list.splice(0);
        draw_tiles(letters_drawn, 7); // draw brand new 7 tiles
        generate_player_hand(letters_drawn); // render tiles drawn
        score = 0;
        $("#error_message").html("Game Restarted");
        $("#tile_removed").html("");
        $("#score").html("Score: 0");
        $("#recall_tiles").attr('disabled', 'disabled');
        $("#end_turn").attr('disabled', 'disabled');
    });
}

function make_end_turn_button() {
    $("#end_turn").click(function() {
        console.log("END TURN:");
        // process all tiles on board
        // if first round
        // more than one tiles in the pending tile array
        $("#tile_removed").html("");
        if (tile_class_array.length > 1) {
            var temp_array = tile_class_array;
            tile_class_array = sort_tiles(tile_class_array);
            // sort it, if it has a diagonal tile in it, function will return empty tile
            if (tile_class_array.length === 0) {
                $("#error_message").html("Please place tiles either horizontally or vertically");
                tile_class_array = temp_array;
                return;
            }
            // console.log("Sort finished");
            // console.log(tile_class_array.length);
            // sort all the tiles, either from top -> down or left -> right
            if (!check_tile(tile_class_array)) {
                // check for illegally placed tiles
                console.log("Tiles are placed too far from one another")
                return;
            }
        }
        // if (game_started(tile_class_array) === true) {
        // if start is filled and tiles are in legal locations
        var word = join_word(tile_class_array, "");
        console.log("WORD IS " + word);
        // join the letters up into a word
        // Thankful for Jason for sharing this
        if (dict[word] === true) {
            // thankful for Jason for finding and sharing this
            score = display_word_and_add_score(tile_class_array, score);

            replenish_player_hands(letters_drawn, tile_class_array);

            // remove_draggable(tile_array);
            make_tiles_and_cell_permanent(tile_array);
            // all tiles on board are removed permanently from the board

            // console.log(score)
            tile_class_array.splice(0);
            tile_array.splice(0);
            // console.log("AFTER reset arrays ");
            // reset pending tile array
            console.log("END TURN: SUCCESS");
            print_all_arrays();
            if (tile_class_array.length == 0 && tile_array == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
                $("#end_turn").attr('disabled', 'disabled');
            }
            return;
        } else {
            console.log("END TURN: cannot find word");
            $("#error_message").html("Cannot find the word: " + word);
            return;
        }
    });
}