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
    $('.squirrelCensus').fadeTo(0, 0);
    $('.projectInfo').fadeTo(0, 0);

    // Giving more information if prompted
    $('#transitionButton').click(function(){
        $('#transitionButton').fadeOut(800);
        $('#transition2Context').fadeOut(800);
        $('.squirrelCensus').delay(1000).fadeTo(1600, 1);
        $('.projectInfo').delay(2600).fadeTo(1600, 1);
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

    /* Quotes Functions (same as Context Functions) */

    // Hiding everything that we need to
    $('#firstQuote').fadeTo(0,0);
    $('#secondQuote').fadeTo(0,0);
    $('#thirdQuote').fadeTo(0,0);
    $('#fourthQuote').fadeTo(0,0);

    // Giving more information if prompted
    $('#quotesTransition').click(function(){
        $('#quotesTransition').fadeOut(800);
        $('#transition2Quotes').fadeOut(800);
        $('#firstQuote').delay(1000).fadeTo(800,1);
        $('#secondQuote').delay(1800).fadeTo(800,1);
        $('#thirdQuote').delay(2600).fadeTo(800,1);
        $('#fourthQuote').delay(3400).fadeTo(1600,1);
    })

});

