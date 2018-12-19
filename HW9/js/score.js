function calculate_score(tile_class_array) {
    var current_score = 0;
    for (var i = 0; i < tile_class_array.length; i++) {
        var score_of_letter = tile_class_array[i].value;
        if (tile_class_array[i].letter_value === "double_letter") {
            // a letter is worth double its points
            score_of_letter = tile_class_array[i].value * 2;
        } else if (tile_class_array[i].letter_value === "triple_letter") {
            score_of_letter = tile_class_array[i].value * 3;
            // a letter is worth triple its points
        }
        current_score += score_of_letter;
        if (tile_class_array[i].letter_value === "double_word") {
            current_score *= 2;
            // double the sum of the point the sum of the point
        } else if (tile_class_array[i].letter_value === "triple_word") {
            current_score *= 3;
            // triple the sum of the point
        }
    }
    if (number_of_round == 0) {
        current_score *= 2;
        // since it is the first round, double score on start
    }
    // console.log("calculating score: " + score);
    return current_score;
}