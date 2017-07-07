var express = require('express');
const router = express.Router();
module.exports = router;



//*************************************************
//
// global variable declarations
//
//*************************************************

var mysteryArray = "Coffee".toUpperCase().split("");  // word to guess
var screenArray = []; // the array to display on the screen
var spentLetterArray = []; // the array to hold the used guesses
const LIMIT = 10;
var userGuessesLeft = LIMIT; // to keep track of how many guesses are left
//var errorMessages = []; // error messages to send back to mustache


//==================================================
//
// function declarations
//
//==================================================
function screenArrayInit(){
// fill the screen array with blanks to start
  var output = [];
  mysteryArray.forEach(function (param) {
    output.push("_");
  });
  return output;
};

function updateScreenArray(guess, wordArray, displayArray){
// update the displayed array with the new guess
  var outputArray = [];

  // iterate thru the wordArray
  for (var i = 0; i < wordArray.length; i++) {
    // if we get a match, put the guess in the outputArray
    if (guess === wordArray[i]) {
      outputArray[i] = guess;
    } else {
      // otherwise, put in the presently displayed character
      outputArray[i] = displayArray[i];
    }
  }

  return outputArray;
};

function noMoreBlanks( inputArray) {
// return 'true' if the array has no more blanks '_'
  let test = true;
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i] == "_") {
      test = false;  // found a blank!
    }
  }
  return test;
}

//------------------------------------------------
//
//  GET actions
//
//-------------------------------------------------

router.get('/', function (req, res) {

  // we would get a new word here, starting a new game
  userGuessesLeft = LIMIT;
  screenArray = screenArrayInit();
  spentLetterArray = []; // empty the used letter bin
  let errorMessages = [];    // clear the error display

  res.render('../views/index', {
    WordToGuess: screenArray,
    guessesLeft: userGuessesLeft,
    spentLetters: spentLetterArray,
    errors: errorMessages
  })
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++
//
// POST actions
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/', function (req, res) {
  var errorMessages = [];

  // we want a sigle alpha character
  req.checkBody("guess","Please enter only letters!").isAlpha();
  req.checkBody("guess","Please enter only one letter!").isLength({min:0,max:1});

  // use the custom validator to flag letters already used
  req.checkBody("guess","You've already guessed that letter!").isNotIn(spentLetterArray);

  req.getValidationResult().then(function(result) {
    if ( result.isEmpty() ) {
      // no errors; put the user's guess in the proper place
      guess = req.body.guess.toUpperCase();
      screenArray = updateScreenArray(guess, mysteryArray, screenArray);
      spentLetterArray.push(guess); // add guess to spent letters
      if (noMoreBlanks(screenArray)) {
        res.send("You win!");
        res.redirect('/');  // start a new game
      }

      // reduce the number of available tries by 1
      userGuessesLeft--;
      if (userGuessesLeft < 1) {
        res.send("You lose!");
        res.redirect('/');  // start a new game
      }
    } else {
        // get the array of errors
        errors = result.array();

        // push all the message portions to an output array
        errors.forEach(function (item){
          errorMessages.push(item.msg);
        });
    }

    // now render the page with updated data
    res.render('../views/index', {
      WordToGuess: screenArray,
      guessesLeft: userGuessesLeft,
      spentLetters: spentLetterArray,
      errors: errorMessages
    });
  });

});
