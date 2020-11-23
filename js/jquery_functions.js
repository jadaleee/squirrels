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
    $('#goBack').hide();

    // Giving more information if prompted
    $('#transitionButton').click(function(){
        $('#transitionButton').fadeOut(800);
        $('#transition2Context').fadeOut(800);
        $('#dataContext').delay(1000).fadeIn(1600);
        $('#nextButtonHistorical').delay(1000).fadeIn(1600);
    })

    // Providing more historical information
    $('#nextButtonHistorical').click(function(){
        $('#nextButtonHistorical').fadeOut(500);
        $('#goBack').fadeIn(500);
        $('#dataContext').fadeTo(1600, 0);
        $('#historicalContext').fadeTo(1600, 1);
    })

    $('#goBack').click(function(){
        $('#goBack').fadeOut(500);
        $('#nextButtonHistorical').fadeIn(500);
        $('#dataContext').fadeTo(1600, 1);
        $('#historicalContext').fadeTo(1600, 0);
    })

    /* Squirrel Trivia Visualization Functions */

    $('.answer-reveal').hide();

    $('#question-1-answer').click(function(){
        $('#answer-1').fadeIn(800);
    })

    $('#question-2-answer').click(function(){
        $('#answer-2').fadeIn(800);
    })

    $('#question-3-answer').click(function(){
        $('#answer-3').fadeIn(800);
    })



});

