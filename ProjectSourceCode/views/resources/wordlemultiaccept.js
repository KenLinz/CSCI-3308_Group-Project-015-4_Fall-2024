let guesses = [];
let word = undefined;

async function generateWord() {
    temp = "";
   // get random 6 letter words until dictionary recognizes it as a real word
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
    //         return true;
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         return false;
    //     });
    //     await new Promise((resolve, reject) => setTimeout(resolve, 100));
    //     word = testWord;
    //     if (isValid == true){
    //         break;
    //     }
    // }

    await new Promise((resolve, reject) => setTimeout(resolve, 2));

    document.getElementById("game").style.visibility = "visible";
    document.getElementById("loading").style.visibility = "hidden";

    word = document.getElementById("wordleword").textContent;
    //console.log("WORD IS: " + word);

    // // Auto-focus the input field
    document.getElementById("guess").focus();

    // Add event listener for Enter key
    document.getElementById("guess").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            check(); // Call the check function
        }
    });
}

//sets box's letter and color
function drawGuess(index, char, color) {
  row = guesses.length + 1;
  letter = document.getElementById(
    "Letter" + row.toString() + index.toString(),
  );
  letter.innerHTML = char.toString();
  box = document.getElementById(
    "letterbox" + row.toString() + index.toString(),
  );
  box.style.backgroundColor = color;
}

//sends game stats to database
async function updateUserStats(word, numGuesses) {
    try {
        // console.log(document.getElementById("usersent").textContent);
        // console.log(numGuesses);
        const response = await fetch('/api/endchallenge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userrecieved_guesses: numGuesses
            })
        });
        // console.log('Match Updated');
    } catch (error) {
        console.error('Error update match:', error);
        document.getElementById("winlossmsg").textContent="an error has occured with update match"; 
    }
}

//called when guess button is pressed
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
            if(w.includes(g[i])){
                drawGuess(i + 1, g[i], "yellow");
                w[w.indexOf(g[i])] = "0";
            }
            else{
                drawGuess(i + 1, g[i], "red");
            } 
        }
        }
        guesses.push(guess);

        return mtchCnt;
    })
    .catch(error => {
        console.error('Error:', error);
        return 0;
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10));

    // Clear and refocus the input field after processing the guess
    document.getElementById("guess").value = "";
    document.getElementById("guess").focus();

   //checks for winning or loosing state and displays results accordingly
    if(matchCount == 6 | guesses.length == 6){
        document.getElementById("guessbutton").style.visibility = 'hidden';
        document.getElementById("wordmsg").textContent="The word was \"" + word +"\""; 
        
        if(guesses.length == 6 & matchCount != 6){
            document.getElementById("numguessmsg").textContent="You didn't find the word!";
        }
        else{
            if(guesses.length == 1){
                document.getElementById("numguessmsg").textContent="You found the word in " + guesses.length + " guess!";
            }
            else{
                document.getElementById("numguessmsg").textContent="You found the word in " + guesses.length + " guesses!";
            }
        }
        await updateUserStats(word, guesses.length);
        displayEndgamePopup(true);
    }


    return;
}

function displayEndgamePopup(gameWon){
    document.getElementById("popup").style.visibility = 'visible';
}

generateWord();

