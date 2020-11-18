/* * * * * * * * * * * * * *
*     JQuery Functions     *
* * * * * * * * * * * * * */

$(document).ready(function(){

    /* Hook Visualization Functions */

    // Hiding later information!
    $('#comparingGuess').hide();

    // Making sure that the user inputs a valid number
    $('#userSquirNum').keyup(function(){
        if ($('#userSquirNum').val() < 0){
            alert("You can't have negative squirrels!");
            $('#userSquirNum').val('0');
        }
    });

    // After the user submits, hide the guessing and cue the information!
    $('#askingUserSquirNum').submit(function(){
        $('#userGuess').hide(1000);
        $('#comparingGuess').show(1000);
    });

    /* Context Visualization Functions */

    /* Squirrel Trivia Visualization Functions */

});

