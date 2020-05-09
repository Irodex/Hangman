"use strict";
const difficultySelection = document.getElementById("difficultySelection");
const welcomeScreen = document.getElementById("welcomeScreen");
const guessButton = document.getElementById("guessButton");
const gameScreen = document.getElementById("gameScreen");
const resetGame = document.getElementById("resetGame")
const gameForm = document.getElementById("gameForm");
const userInput = document.getElementById("userInput");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const hangManWord = document.getElementById("hangManWord");
const difficulty = document.getElementById("difficulty");

var correctGuesses = 0;
var incorrectGuesses = 0;





let game;


async function fetchRandomWord(difficulty) {
    const response = await fetch(`https://hangman-micro-service-bpblrjerwh.now.sh/?difficulty=${difficulty}`);
    const wordObject = await response.json();
    console.log(wordObject.word);
    return wordObject.word;

}

class HangMan {
    constructor() { }
    async setup(difficulty) {
        this.currentGuesses = [];
        this.randomWord = await fetchRandomWord(difficulty);
        this.numberOfGuesses = 0;
        this.wordArray = Array.from(this.randomWord);

        hangManWord.innerHTML = "";
        for (var h = 0; h < this.wordArray.length; h++) {
            if (this.wordArray[h] in this.currentGuesses) {
                hangManWord.innerHTML += this.wordArray[h] + " ";
            }
            else { hangManWord.innerHTML += `  -` }
        }

    }

    guess(val) {
        this.numberOfGuesses += 1;
        return this.randomWord === val;
    }

}


function drawHangMan() {
    //head
    if (incorrectGuesses >= 1) {
        context.beginPath();
        context.fillStyle = "black"
        context.arc(150, 45, 25, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
    }
    //body
    if (incorrectGuesses >= 2) {
        context.beginPath();
        context.moveTo(150, 70);
        context.lineTo(150, 130);
        context.stroke();
    }
    //right arm
    if (incorrectGuesses >= 3) {
        context.beginPath();
        context.moveTo(150, 80);
        context.lineTo(185, 100);
        context.stroke();
    }
    //left arm
    if (incorrectGuesses >= 4) {
        context.beginPath();
        context.moveTo(150, 80);
        context.lineTo(115, 105);
        context.stroke();

    }
    //left leg
    if (incorrectGuesses >= 5) {
        context.beginPath();
        context.moveTo(150, 130);
        context.lineTo(50, 250);
        context.stroke();
    }

    //right leg
    if (incorrectGuesses >= 6) {
        context.beginPath();
        context.moveTo(150, 130);
        context.lineTo(250, 250);
        context.stroke();
    }
    //face
    if (incorrectGuesses >= 7) {
        context.beginPath();
        context.arc(150, 60, 10, 0.15 * Math.PI, 0.85 * Math.PI, true);
        context.moveTo(140, 40);
        context.lineTo(135, 50);
        context.moveTo(160, 40);
        context.lineTo(165, 50)
        context.stroke();

        // lost game
    }

}



difficultySelection.addEventListener("submit", async function (difficultySelectionClickEvent) {
    difficultySelectionClickEvent.preventDefault();

    game = new HangMan();
    await game.setup(difficulty.value);
    console.log(game);
    welcomeScreen.className = "hidden";
    gameScreen.className = "";


});

function getRemainingUnknowns() {
    return game.randomWord
        .split('')
        .filter((letter) => {
            return !game.currentGuesses.includes(letter)
        })
        .length;
}

// guess function
gameForm.addEventListener("submit", function (gameFormSubmitEvent) {
    gameFormSubmitEvent.preventDefault();
    // validations
    if (!userInput.value) {
        return alert(`You have to provide an input!`);
    }

    const guess = (userInput.value);


    if (
        !guess ||
        typeof guess !== `string` ||
        !/[a-z]/.test(guess.toLowerCase())
    ) {
        return alert(`You must provide a valid input`);
    }

    if (guess.length > 1) {
        return alert(`You are only supposed to enter one letter at a time`);
    }

    if (game.currentGuesses.includes(guess)) {
        return alert(`You have already guessed the letter ` + guess);
    }

    game.currentGuesses.push(guess);
    game.currentGuesses.sort();
    game.numberOfGuesses++;

    // checkWin
    const remainingUnknowns = getRemainingUnknowns();

    if (remainingUnknowns === 0) {
        // win
    }
    // drawNext
    incorrectGuesses ++;
    drawHangMan();


    if (game.wordArray.length == correctGuesses) {
        return alert("You Win!!!")
    };
    if (incorrectGuesses >= 7) { return alert("You lose!! :( The word was: " + game.randomWord) }

    hangManWord.innerText = getWordHolderText();
    userInput.value = '';

    console.log("number of Guesses: " + game.numberOfGuesses)
    console.log("correct guesses: " + correctGuesses)
    console.log("bad guesses: " + incorrectGuesses)
    console.log(game.wordArray.length + "length of array")
}

);

function getWordHolderText() {
    return game.randomWord
        .split('')
        .map(letter => game.currentGuesses.includes(letter) ? letter : '_')
        .join(' ')
}

