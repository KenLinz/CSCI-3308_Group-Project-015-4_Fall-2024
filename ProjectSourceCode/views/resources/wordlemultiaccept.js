// const { urlencoded } = require("body-parser");

const { off } = require("../..");

let guesses = [];
let word = undefined;

async function generateWord() {
    temp = "";
    //get random 6 letter words until dictionary recognizes it as a real word
    // while(true){
    //     let testWord = await fetch('https://random-word-api.herokuapp.com/word?length=6')
    //     .then(response => response.json())
    //     .then(function (data) {
    //         const testWord = data[0];
    //         return data[0];
    //     });
    //     dictionaryUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + testWord;
    //     let isValid = await fetch(dictionaryUrl) 
    //     .then(response => {
    //         if (!response.ok) {
    //             document.getElementById("message").textContent="looking for valid word, delete this message later";
    //             throw new Error('Network response was not ok');
    //             return false;
    //         }
    //     })
    //     .then(data => {
    //         wordExists = true;
    //         document.getElementById("message").textContent="";
    //         console.log(wordExists);
    //         return true;
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         return false;
    //     });
    
    //     // console.log("picked word " + testWord);
    //     // console.log("is valid? " + isValid);
        
    //     await new Promise((resolve, reject) => setTimeout(resolve, 100));
    //     word = testWord;
    //     if (isValid == true){
    //         break;
    //     }
    // }

    word = document.getElementById("wordleword").textContent;

    console.log("WORD IS: " + word);

}

function drawGuess(index, char, color) {
  row = guesses.length + 1;
  letter = document.getElementById(
    "Letter" + row.toString() + index.toString(),
  );
  console.log(letter);
  letter.innerHTML = char.toString();
  box = document.getElementById(
    "letterbox" + row.toString() + index.toString(),
  );
  console.log(box);
  box.style.backgroundColor = color;
}


async function updateUserStats(word, numGuesses) {
    try {
        console.log(document.getElementById("usersent").textContent);
        console.log(numGuesses);
        const response = await fetch('/api/endchallenge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userrecieved_guesses: numGuesses
            })
        });

        console.log('Match Updated');
    } catch (error) {
        console.error('Error update match:', error);
        document.getElementById("winlossmsg").textContent="an error has occured with update match"; 
    }
}


async function check() {
    let guess = document.getElementById("guess").value;

    //check if word is 6 letters
    if(guess.length != 6){
        document.getElementById("message").textContent="Please enter a 6 letter word!";
        return;
    }

    //API call to check if word exists in dictionary
    //returns the number of matching letters
    wordExists = false;
    dictionaryUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + guess;
    matchCount = await fetch(dictionaryUrl) 
    .then(response => {
        if (!response.ok) {
            document.getElementById("message").textContent="Please enter a valid word!";
            throw new Error('Network response was not ok');
            
            return 0;
        }
    })
    .then(data => {
        wordExists = true;
        document.getElementById("message").textContent="";
        console.log(wordExists);

        console.log(guess);
        
        const g = guess.split("");
        const w = word.split("");
        let mtchCnt = 0;
        let i = 0;
        for (let i = 0; i <= 5; i++) {
        if (g[i] == w[i]) {
            //make green
            drawGuess(i + 1, g[i], "green");
            mtchCnt ++;
        } else {
            let n = 0;
            let c = 0;
            while (n <= 5) {
            if (g[i] == w[n]) {
                c++;
            }
            n++;
            }
            if (c == 0) {
            //make red
            drawGuess(i + 1, g[i], "red");
            } else {
            //make yellow
            drawGuess(i + 1, g[i], "yellow");
            }
        }
        }
        guesses.push(guess);
        console.log(guesses);

        return mtchCnt;
    })
    .catch(error => {
        console.error('Error:', error);
        return 0;
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10));
    console.log(matchCount);

    //add more stuff to win and loss states eventually!
    if(matchCount == 6){

        document.getElementById("wordmsg").textContent="The word was \"" + word +"\""; 
        document.getElementById("youstats").textContent="You found the word in " + guesses.length + " guesses!";
        document.getElementById("theirstats").textContent="they found the word in " + guesses.length + " guesses!";

        console.log(document.getElementById("usersent_guesses").textContent);
        opGuess = parseInt(document.getElementById("usersent_guesses").textContent);
        
        if(oppGuess > guesses.length){
            document.getElementById("winlossmsg").textContent="You loose!";
        }
        else if(oppGuess < guesses.length){
            document.getElementById("winlossmsg").textContent="You win!";
        }
        else if(oppGuess == guesses.length){
            document.getElementById("winlossmsg").textContent="You tied!";
        }
    
        
        await updateUserStats(word, guesses.length);
        displayEndgamePopup(true);
    }
    else if(guesses.length == 6){
        document.getElementById("winlossmsg").textContent="Game loss!";
        document.getElementById("wordmsg").textContent="The word was " + word;
        await updateUserStats(word, guesses.length); 
        displayEndgamePopup(false);
    }

    return;
}

function displayEndgamePopup(gameWon){
    document.getElementById("popup").style.visibility = 'visible';
}

generateWord();

