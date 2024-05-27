/* Thanks to Jan Schreiber https://codepen.io/janschreiber/pen/xZbEvM


*/




// when the DOM is fully loaded:
document.addEventListener("DOMContentLoaded", () => {
    // start the game
    start();

    // add event listeners to all the cells
    for (let i = 0; i < 9; i++) {
        document.getElementById("cell" + i).addEventListener("click", () => cellClicked("cell" + i));
    }

    // add event listener to the restart button
    document.getElementById("restart").addEventListener("click", () => restartGame(true));

    // add event listener to the OK button in the options modal
    document.getElementById("okBtn").addEventListener("click", getOptions);
});

// GLOBAL VARIABLES

let moves = 0;  
let winner = 0;  
let x = 1;  
let o = 3;   
let player = x;   
let computer = 0;   
let whoseTurn = x;   
let gameOver = false;  

// score tracking
let score = {
    ties: 0,
    player: 0,
    computer: 0
};

// Symbols for players
let xSymbol = "<span class=\"x\"><i class=\"fa-solid fa-x\"></i></span>";
let oSymbol = "<span class=\"o\"><i class=\"fa-solid fa-o\"></i></span>";

// Default
let playerSymbol = xSymbol;
let computerSymbol = oSymbol;

let myGrid = null;  

// GRID OBJECT
class Grid {
    constructor() {
        this.cells = Array(9).fill(0);  // Initialize a 9-element array with 0s
    }

    // Get indices of free cells
    getFreeCellIndex() {
        return this.cells.map((cell, index) => (cell === 0 ? index : null)).filter(index => index !== null);
    }

    // Get row values 
    getRowValues(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("invalid argument for row values!");
            return undefined;
        }
        return this.cells.slice(index * 3, index * 3 + 3);
    }

    // Get row index
    getRowIndex(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("Invalid argument for row indexes!");
            return undefined;
        }
        return Array.from({ length: 3 }, (_, i) => index * 3 + i);
    }

    // Get column values
    getColumnValues(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("invalid argument for column values");
            return undefined;
        }

        return [index, index + 3, index + 6].map(i => this.cells[i]);
    }

    // Get column index
    getColumnIndex(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("Invalid argument for column indexes!");
            return undefined;
        }

        return [index, index + 3, index + 6];
    }

    // Get values of a diagonal
    getDiagValues(arg) {
        if (![0, 1].includes(arg)) {
            console.error("Invalid argument for diagonal values!");
            return undefined;
        }

        return arg === 0 ? [this.cells[0], this.cells[4], this.cells[8]] : [this.cells[2], this.cells[4], this.cells[6]];
    }

    // Get indices of a diagonal
    getDiagIndex(arg) {
        if (![0, 1].includes(arg)) {
            console.error("Invalid argument for diagonal indexes!");
            return undefined;
        }

        return arg === 0 ? [0, 4, 8] : [2, 4, 6];
    }

    // Find the first free cell that could complete two in a row
    getFirstWithTwoInARow(agent) {
        if (![computer, player].includes(agent)) {
            console.error("get first index with two in a row accepts only player or computer as argument!");
            return undefined;
        }

        const sum = agent * 2;  // The target sum to identify two in a row
        const freeCells = shuffleArray(this.getFreeCellIndex());  // Get shuffled free cells

        for (const freeCell of freeCells) {
            for (const i of [0, 1, 2]) {
                const rowV = this.getRowValues(i);
                const rowI = this.getRowIndex(i);
                const colV = this.getColumnValues(i);
                const colI = this.getColumnIndex(i);

                if ((sumArray(rowV) === sum && rowI.includes(freeCell)) || (sumArray(colV) === sum && colI.includes(freeCell))) {
                    return freeCell;
                }
            }

            for (const j of [0, 1]) {
                const diagV = this.getDiagValues(j);
                const diagI = this.getDiagIndex(j);
                if (sumArray(diagV) === sum && diagI.includes(freeCell)) {
                    return freeCell;
                }
            }
        }
        return false;
    }

    // Reset the grid to its initial state
    reset() {
        this.cells.fill(0);
        return true;
    }
}

// HELPER FUNCTIONS

// Sum the values in an array
const sumArray = array => array.reduce((sum, value) => sum + value, 0);


// Shuffle array
const shuffleArray = array => {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

// random integer
const intRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// MAIN FUNCTIONS

// start the game
function start() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player;  // Default
    myGrid.reset();  // Reset
    setTimeout(showOptions, 500);  // Show modal 
}



// Make the player X
function makePlayerX() {
    player = x;
    computer = o;
    whoseTurn = player;
    playerSymbol = xSymbol;
    computerSymbol = oSymbol;
   
}

// Make the player O and start the computer's turn
function makePlayerO() {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerSymbol = oSymbol;
    computerSymbol = xSymbol;
    setTimeout(makeComputerMove, 400);
}

// Handle a cell being clicked 
function cellClicked(id) {
    const cell = parseInt(id.slice(-1));  // Get the cell index from the ID
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        return false;  // Invalid
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerSymbol;  

    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = player;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = computer;
        makeComputerMove();
    }
    return true;
}

// Restart the game
function restartGame(ask) {
    if (moves > 0) {
        const response = confirm("Are you sure you want to start over?");
        if (!response) return;
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;

    myGrid.reset();
    for (let i = 0; i <= 8; i++) {
        const id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    if (ask) {
        setTimeout(showOptions, 500);
    }
}

// make the computer play the game
function makeComputerMove() {
    if (gameOver) return false;

    let cell = -1;
    let myArr = [];

    const corners = [0, 2, 6, 8];
    if (moves >= 3) {
        cell = myGrid.getFirstWithTwoInARow(computer);
        if (cell === false) {
            cell = myGrid.getFirstWithTwoInARow(player);
        }
        if (cell === false) {
            myArr = myGrid.getFreeCellIndex();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
        // Avoid a catch-22 situation:
        if (moves === 3 && myGrid.cells[4] === computer && player === x) {
            if (myGrid.cells[7] === player && [myGrid.cells[0], myGrid.cells[2]].includes(player)) {
                myArr = [6, 8];
                cell = myArr[intRandom(0, 1)];
            } else if (myGrid.cells[5] === player && [myGrid.cells[0], myGrid.cells[6]].includes(player)) {
                myArr = [2, 8];
                cell = myArr[intRandom(0, 1)];
            } else if (myGrid.cells[3] === player && [myGrid.cells[2], myGrid.cells[8]].includes(player)) {
                myArr = [0, 6];
                cell = myArr[intRandom(0, 1)];
            } else if (myGrid.cells[1] === player && [myGrid.cells[6], myGrid.cells[8]].includes(player)) {
                myArr = [0, 2];
                cell = myArr[intRandom(0, 1)];
            }
        } else if (moves === 3 && myGrid.cells[4] === player && player === x) {
            if (myGrid.cells[2] === player && myGrid.cells[6] === computer) {
                cell = 8;
            } else if (myGrid.cells[0] === player && myGrid.cells[8] === computer) {
                cell = 6;
            } else if (myGrid.cells[8] === player && myGrid.cells[0] === computer) {
                cell = 2;
            } else if (myGrid.cells[6] === player && myGrid.cells[2] === computer) {
                cell = 0;
            }
        }
    } else if (moves === 1 && myGrid.cells[4] === player) {
        cell = shuffleArray(corners)[0];
    } else if (moves === 2 && myGrid.cells[4] === player && computer === x) {
        if (myGrid.cells[0] === computer) {
            cell = 8;
        } else if (myGrid.cells[2] === computer) {
            cell = 6;
        } else if (myGrid.cells[6] === computer) {
            cell = 2;
        } else if (myGrid.cells[8] === computer) {
            cell = 0;
        }
    } else if (moves === 0 && intRandom(1, 10) < 8) {
        cell = corners[intRandom(0, 3)];
    } else {
        if (myGrid.cells[4] === 0) {
            cell = 4;
        } else {
            myArr = myGrid.getFreeCellIndex();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }

    const id = "cell" + cell.toString();
    console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = computerSymbol;
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}

// Check if the game is over and determine the winner
function checkWin() {
    winner = 0;

    // Check rows
    for (let i = 0; i <= 2; i++) {
        const row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] === row[1] && row[0] === row[2]) {
            winner = row[0] === computer ? computer : player;
            if (row[0] == computer) {
                score.computer++;
                console.log("computer wins");
            } else {
                score.player++;
                console.log("player wins");
            }
            const tmpAr = myGrid.getRowIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // Check columns
    for (let i = 0; i <= 2; i++) {
        const col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] === col[1] && col[0] === col[2]) {
            if (col[0] == computer) {
                score.computer++;
            } else {
                score.player++;
            }
            const tmpAr = myGrid.getColumnIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // Check diagonals
    for (let i = 0; i <= 1; i++) {
        const diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] === diagonal[1] && diagonal[0] === diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
            } else {
                score.player++;
                winner = player;
            }
            const tmpAr = myGrid.getDiagIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // If the board is full and no winner, it's a tie
    if (myGrid.getFreeCellIndex().length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }

    return winner;
}

// Show the options modal to choose player
function showOptions() {
    document.getElementById("rx").checked = player === x;
    document.getElementById("ro").checked = player === o;
    document.getElementById("optionsModal").style.display = "block";
}

// Get options selected by the user
function getOptions() {
    if (document.getElementById('rx').checked) {
        player = x;
        computer = o;
        whoseTurn = player;
        playerSymbol = xSymbol;
        computerSymbol = oSymbol;
    } else {
        player = o;
        computer = x;
        whoseTurn = computer;
        playerSymbol = oSymbol;
        computerSymbol = xSymbol;
        setTimeout(makeComputerMove, 400);
    }
    document.getElementById("optionsModal").style.display = "none";
}


// Close a modal dialog
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Announce the winner
function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    setTimeout(closeModal, 1400, "winAnnounce");
}

// End the game and display the result
function endGame(who) {
    if (who === player) {
        announceWinner("Congratulations, you won!");
    } else if (who === computer) {
        announceWinner("Computer wins!");
    } else {
        announceWinner("It's a tie!");
    }
    gameOver = true;
    whoseTurn = 0;
    moves = 0;
    winner = 0;
    document.getElementById("computer_score").innerHTML = score.computer;
    document.getElementById("tie_score").innerHTML = score.ties;
    document.getElementById("player_score").innerHTML = score.player;
    for (let i = 0; i <= 8; i++) {
        const id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
    setTimeout(restartGame, 800);
}
