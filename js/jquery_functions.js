/* * * * * * * * * * * * * *
*     JQuery Functions     *
* * * * * * * * * * * * * */

$(document).ready(function(){

    /* Homepage Animations */
    $('#titleSquirrel').fadeTo(0,0)
    $('#titleCity').fadeTo(0,0)
    $('#bench').hide()
    $('#tree1').hide()
    $('#tree2').hide()
    $('#tree3').hide()
    $('#tree4').hide()
    $('#tree5').hide()
    $('#tree6').hide()
    $('#tree7').hide()
    $('#homepagesquirrel').hide()

    $('#titleSquirrel').delay(800).fadeTo(1200, 1);
    $('#titleCity').delay(1600).fadeTo(1200, 1);
    $('#subhead').delay(1600).fadeTo(1200, 1);
    $('#bench').delay(1800).fadeIn(1200);
    $('#tree5').delay(2000).fadeIn(1200);
    $('#tree4').delay(2200).fadeIn(1200);
    $('#tree3').delay(2400).fadeIn(1200);
    $('#tree2').delay(2600).fadeIn(1200);
    $('#tree1').delay(2800).fadeIn(1200);
    $('#tree6').delay(3000).fadeIn(1200);
    $('#tree7').delay(3200).fadeIn(1200);
    $('#homepagesquirrel').delay(3300).fadeIn(1200);


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
        $('#censusInfo').css("z-index", "-1")
    })

    /* Squirrel Trivia Visualization Functions */

    // Hiding all answers and question set 2
    $('.answer-reveal').fadeTo(0, 0);
    $('.question-set-2').hide();

    // Revealing answer to question 1
    $('#question-1-answers-A').click(function(){
        $('#answer-1').fadeTo(800, 1);
    });

    $('#question-1-answers-B').click(function(){
        $('#answer-1').fadeTo(800, 1);
    });

    // Revealing answer to question 2
    $('#question-2-answers-A').click(function(){
        $('#answer-2').fadeTo(800, 1);
    });

    $('#question-2-answers-B').click(function(){
        $('#answer-2').fadeTo(800, 1);
    });

    // Revealing answer to question 3
    $('#question-3-answers-A').click(function(){
        $('#answer-3').fadeTo(800, 1);
    });

    $('#question-3-answers-B').click(function(){
        $('#answer-3').fadeTo(800, 1);
    });

    // More questions (set 2 of questions)
    $('#moreQuestions').click(function(){
        $('.question-set-1').hide();
        $('.question-set-2').delay(600).fadeTo(800, 1).show();
    })

    // Answers to question set 2

    // Revealing answer to question 1
    $('#question-1-answers-A-2').click(function(){
        $('#answer-1-2').fadeTo(800, 1);
    });

    $('#question-1-answers-B-2').click(function(){
        $('#answer-1-2').fadeTo(800, 1);
    });

    // Revealing answer to question 2
    $('#question-2-answers-A-2').click(function(){
        $('#answer-2-2').fadeTo(800, 1);
    });

    $('#question-2-answers-B-2').click(function(){
        $('#answer-2-2').fadeTo(800, 1);
    });

    // Revealing answer to question 3
    $('#question-3-answers-A-2').click(function(){
        $('#answer-3-2').fadeTo(800, 1);
    });

    $('#question-3-answers-B-2').click(function(){
        $('#answer-3-2').fadeTo(800, 1);
    });

    /* Quotes Functions (same as Context Functions) */

    // Hiding everything that we need to
    $('#firstQuote').fadeTo(0,0);
    $('#secondQuote').fadeTo(0,0);
    $('#thirdQuote').fadeTo(0,0);
    $('#fourthQuote').fadeTo(0,0);
    $('.quotesRelative').fadeTo(0,0);

    // Giving more information if prompted
    $('#quotesTransition').click(function(){
        $('#quotesTitle').fadeOut(800);
        $('#quotesInfo').css("z-index", "-1");
        $('.quotesRelative').delay(1000).fadeTo(1000,1);
        $('#firstQuote').delay(1200).fadeTo(1200,1);
        $('#secondQuote').delay(2600).fadeTo(1400,1);
        $('#thirdQuote').delay(4000).fadeTo(1400,1);
        $('#fourthQuote').delay(5400).fadeTo(2000,1);
    })

    /* Conclusion Animations */
    $('#conclusion-message').hide()
    $('#conclusion-squirrel').hide()

    let reachedConclusion = $('#conclusion').offset().top;

    $(window).scroll(function() {
        var place = window.pageYOffset + 200;
        if(place > reachedConclusion) {
            $('#conclusion-message').fadeIn(1200);
            $('#conclusion-squirrel').delay(1300).slideDown(1000);
        }
    });

});

