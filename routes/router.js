const express = require('express');
const router = express.Router();
const app = express();

module.exports = router;

let randomWord = "Inconceivable".toUpperCase().split("");
let hiddenWord = [];
var userGuessesLeft = 8;

randomWord.forEach(function (param) {
    hiddenWord.push("_");
});

router.get('/', function (req, res) {
    res.render('../views/index', { WordToGuess: hiddenWord, guessesleft: userGuessesLeft })
});

router.post('/', function (req, res) {
    // if (userGuessesLeft >= 1){
    //     userGuessesLeft--;
    // } 
    //userGuessesLeft++;
    hiddenWord = ["S", "H", "I", "T"];
    res.redirect('/');
});