/* * * * * * * * * * * * * *
*     JQuery Functions     *
* * * * * * * * * * * * * */

$(document).ready(function(){

    /* Hook Visualization Functions */

    // Hiding later information!
    $('#hook-comparingGuess').hide();

    // Making sure that the user inputs a valid number
    $('#userSquirNum').keyup(function(){
        if ($('#userSquirNum').val() < 0){
            alert("You can't have negative squirrels!");
            $('#userSquirNum').val('0');
        }
    });

    // After the user submits, hide the guessing and cue the information!
    $('#squirrelForm').submit(function(){
        var userInput = $('#userSquirNum').val();
        var totalSquirrels = 2373
        var userOff = Math.abs(userInput - totalSquirrels).toLocaleString();

        $('#userGuess').fadeOut(800);
        $('#hook-comparingGuess').delay(1000).fadeIn(1600);
        $('#comparingSquirNum').html("You were off by " + userOff + " squirrels. There are actually <strong> 2,373 unique squirrels </strong> in Central Park!");

    });

    /* Context Visualization Functions */

    // Hiding everything that we need to
    $('#dataContext').hide();
    $('#historicalContext').fadeTo(0, 0);
    $('#nextButtonHistorical').hide();

    // Giving more information if prompted
    $('#transitionButton').click(function(){
        $('#transitionButton').fadeOut(800);
        $('#transition2Context').fadeOut(800);
        $('#dataContext').delay(2000).fadeIn(1600);
        $('#nextButtonHistorical').delay(1000).fadeIn(1600);
    })

    // Providing more historical information
    $('#nextButtonHistorical').click(function(){
        $('#nextButtonHistorical').fadeOut(100);
        $('#dataContext').fadeTo(1600, 0);
        $('#historicalContext').fadeTo(1600, 1);
    })

    // Should add a go back button

    /* Squirrel Trivia Visualization Functions */

});

