let guesses = [];
let word = undefined;

async function generateWord() {
    temp = "";
    //get random 6 letter words until dictionary recognizes it as a real word
    while(true){
        let testWord = await fetch('https://random-word-api.herokuapp.com/word?length=6')
        .then(response => response.json())
        .then(function (data) {
            const testWord = data[0];
            return data[0];
        });
        dictionaryUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + testWord;
        let isValid = await fetch(dictionaryUrl) 
        .then(response => {
            if (!response.ok) {
                throw new Error('choosen word does not exist in dictionary API, reslecting word');
                return false;
            }
        })
        .then(data => {
            wordExists = true;
            document.getElementById("message").textContent="";
            return true;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
        
        await new Promise((resolve, reject) => setTimeout(resolve, 100));
        word = testWord;
        if (isValid == true){
            break;
        }
    }

    document.getElementById("game").style.visibility = "visible";
    document.getElementById("loading").style.visibility = "hidden";

    word = "inbred";
    // console.log("WORD IS: " + word);

    // Auto-focus the input field
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
async function updateUserStats(gameWon, numGuesses) {
    try {
        const response = await fetch('/api/updateStats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gamesPlayed: 1,
                totalGuesses: numGuesses,
                wins: gameWon ? 1 : 0,
                losses: gameWon ? 0 : 1
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update stats');
        }

        const stats = await response.json();
        
        // Calculate and display stats
        const ratio = stats.wins === 0 ? 
            0 : 
            (stats.wins / (stats.wins + stats.losses)).toFixed(2);
            
        const avgGuesses = stats.games_played === 0 ? 
            0 : 
            (stats.total_guesses / stats.games_played).toFixed(1);

        // Update the popup elements
        document.getElementById('ratio').textContent = ratio;
        document.getElementById('avgguess').textContent = avgGuesses;
        document.getElementById('winstreak').textContent = stats.current_streak;

        console.log('Stats updated successfully:', stats);
    } catch (error) {
        console.error('Error updating stats:', error);
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
        offset = 0;
        // wstring = word.toString();
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
    if(matchCount == 6){
        document.getElementById("winlossmsg").textContent="Game won!";
        document.getElementById("wordmsg").textContent="The word was \"" + word +"\""; 
        document.getElementById("numguessmsg").textContent="You found the word in " + guesses.length + " guesses!";
        await updateUserStats(true, guesses.length);
        displayEndgamePopup(true);
    }
    else if(guesses.length == 6){
        document.getElementById("winlossmsg").textContent="Game loss!";
        document.getElementById("wordmsg").textContent="The word was " + word;
        await updateUserStats(false, guesses.length); 
        displayEndgamePopup(false);
    }
    return;
}

function displayEndgamePopup(gameWon){
    document.getElementById("popup").style.visibility = 'visible';
}

generateWord();

