/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 */
function make_bags() {
    ScrabbleTiles["a"] = { "value": 1, "original_distribution": 9, "number_remaining": 9 };
    ScrabbleTiles["b"] = { "value": 3, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["c"] = { "value": 3, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["d"] = { "value": 2, "original_distribution": 4, "number_remaining": 4 };
    ScrabbleTiles["e"] = { "value": 1, "original_distribution": 12, "number_remaining": 12 };
    ScrabbleTiles["f"] = { "value": 4, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["g"] = { "value": 2, "original_distribution": 3, "number_remaining": 3 };
    ScrabbleTiles["h"] = { "value": 4, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["i"] = { "value": 1, "original_distribution": 9, "number_remaining": 9 };
    ScrabbleTiles["j"] = { "value": 8, "original_distribution": 1, "number_remaining": 1 };
    ScrabbleTiles["k"] = { "value": 5, "original_distribution": 1, "number_remaining": 1 };
    ScrabbleTiles["l"] = { "value": 1, "original_distribution": 4, "number_remaining": 4 };
    ScrabbleTiles["m"] = { "value": 3, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["n"] = { "value": 1, "original_distribution": 6, "number_remaining": 6 };
    ScrabbleTiles["o"] = { "value": 1, "original_distribution": 8, "number_remaining": 8 };
    ScrabbleTiles["p"] = { "value": 3, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["q"] = { "value": 10, "original_distribution": 1, "number_remaining": 1 };
    ScrabbleTiles["r"] = { "value": 1, "original_distribution": 6, "number_remaining": 6 };
    ScrabbleTiles["s"] = { "value": 1, "original_distribution": 4, "number_remaining": 4 };
    ScrabbleTiles["t"] = { "value": 1, "original_distribution": 6, "number_remaining": 6 };
    ScrabbleTiles["u"] = { "value": 1, "original_distribution": 4, "number_remaining": 4 };
    ScrabbleTiles["v"] = { "value": 4, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["w"] = { "value": 4, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["x"] = { "value": 8, "original_distribution": 1, "number_remaining": 1 };
    ScrabbleTiles["y"] = { "value": 4, "original_distribution": 2, "number_remaining": 2 };
    ScrabbleTiles["z"] = { "value": 10, "original_distribution": 1, "number_remaining": 1 };
    ScrabbleTiles["_"] = { "value": 0, "original_distribution": 2, "number_remaining": 0 };
}

function calculate_total_remaining() {
    var total = 0;
    var lowercase_alphabet = "abcdefghijklmnopqrstuvwxyz_";
    for (var i = 0; i < lowercase_alphabet.length; i++) {
        total += ScrabbleTiles[lowercase_alphabet[i]].number_remaining;
    }
    $("#total_remaining").html("Letters left: " + total);
}