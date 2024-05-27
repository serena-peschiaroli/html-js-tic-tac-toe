document.addEventListener("DOMContentLoaded", () => {
    start();
    for (let i = 0; i < 9; i++) {
        document.getElementById("cell" + i).addEventListener("click", () => cellClicked("cell" + i));
    }
    document.getElementById("restart").addEventListener("click", () => restartGame(true));
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

let score = {
    ties: 0,
    player: 0,
    computer: 0
};

let xSymbol = "<span class=\"x\">&times;</span>";
let oSymbol = "<span class=\"o\">o</span>";

let playerSymbol = xSymbol;
let computerSymbol = oSymbol;

let myGrid = null;

// GRID OBJECTS
class Grid {
    constructor() {
        this.cells = Array(9).fill(0);
    }

    getFreeCellIndex() {
        return this.cells.map((cell, index) => (cell === 0 ? index : null)).filter(index => index !== null);
    };

    getRowValues(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("invalid argument for row values!");
            return undefined;
        }
        return this.cells.slice(index * 3, index * 3 + 3);
    };

    getRowIndex(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("Invalid argument for row indexes!");
            return undefined;
        }
        return Array.from({ length: 3 }, (_, i) => index * 3 + i);
    };

    getColumnValues(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("invalid argument for column values");
            return undefined;
        }

        return [index, index + 3, index + 6].map(i => this.cells[i]);
    }

    getColumnIndex(index) {
        if (![0, 1, 2].includes(index)) {
            console.error("Invalid argument for column indexes!");
            return undefined;
        }

        return [index, index + 3, index + 6];
    }

    getDiagValues(arg) {
        if (![0, 1].includes(arg)) {
            console.error("Invalid argument for diagonal values!");
            return undefined;
        }

        return arg === 0 ? [this.cells[0], this.cells[4], this.cells[8]] : [this.cells[2], this.cells[4], this.cells[6]];
    }

    getDiagIndex(arg) {
        if (![0, 1].includes(arg)) {
            console.error("Invalid argument for diagonal indexes!");
            return undefined;
        }

        return arg === 0 ? [0, 4, 8] : [2, 4, 6];
    }

    getFirstWithTwoInARow(agent) {
        if (![computer, player].includes(agent)) {
            console.error("get first index with two in a row accepts only player or computer as argument!");
            return undefined;
        }

        const sum = agent * 2;
        const freeCells = shuffleArray(this.getFreeCellIndex());

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

    reset() {
        this.cells.fill(0);
        return true;
    }
}

// HELPER FUNCTIONS
const sumArray = array => array.reduce((sum, value) => sum + value, 0);

const isInArray = (element, array) => array.includes(element);

const shuffleArray = array => {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

const intRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// MAIN FUNCTIONS
function start() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player; // default
    myGrid.reset();
    setTimeout(showOptions, 500);
}

function assignRoles() {
    askUser("Do you want to go first?");
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

function makePlayerX() {
    player = x;
    computer = o;
    whoseTurn = player;
    playerSymbol = xSymbol;
    computerSymbol = oSymbol;

    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
}

function makePlayerO() {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerSymbol = oSymbol;
    computerSymbol = xSymbol;
    setTimeout(makeComputerMove, 400);

    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("noBtn").removeEventListener("click", makePlayerO)
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
}

function cellClicked(id) {
    const cell = parseInt(id.slice(-1));
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerSymbol;
    const rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
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

function makeComputerMove() {
    if (gameOver) return false;

    let cell = -1;
    let myArr = [];

    const corners = [0, 2, 6, 8];
    if (moves >= 3) {
        cell = myGrid.getFirstWithTwoInARow(computer);
        if (cell === false){
         cell = myGrid.getFirstWithTwoInARow(player);   
        } 
        if (cell === false) {
            myArr = myGrid.getFreeCellIndex();
           cell = myArr[intRandom(0, myArr.length - 1)];
        }
        // Avoid a catch-22 situation:
        if (moves === 3 && myGrid.cells[4] === computer && player === x) {
            if (myGrid.cells[7] === player && [myGrid.cells[0], myGrid.cells[2]].includes(player)) {
                myArr = [6,8];
                cell = myArr[intRandom(0,1)];
            } else if (myGrid.cells[5] === player && [myGrid.cells[0], myGrid.cells[6]].includes(player)) {
                myArr = [2,8];
                cell = myArr[intRandom(0,1)];
            } else if (myGrid.cells[3] === player && [myGrid.cells[2], myGrid.cells[8]].includes(player)) {
                myArr = [0,6];
                cell = myArr[intRandom(0,1)];
            } else if (myGrid.cells[1] === player && [myGrid.cells[6], myGrid.cells[8]].includes(player)) {
                myArr = [0,2];
                cell = myArr[intRandom(0,1)];
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
        cell = corners[intRandom(0,3)];
    }else{
        if(myGrid.cells[4] === 0){
            cell = 4;
        }else{
            myArr = myGrid.getFreeCellIndex();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }



    const id = "cell" + cell.toString();
    console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = computerSymbol;
    document.getElementById(id).style.cursor = "default";
    const rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    myGrid.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}


// function checkWin() {
//     const winPatterns = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6]
//     ];

//     for (const pattern of winPatterns) {
//         const [a, b, c] = pattern;
//         if (myGrid.cells[a] > 0 && myGrid.cells[a] === myGrid.cells[b] && myGrid.cells[a] === myGrid.cells[c]) {
//             for (const index of pattern) {
//                 document.getElementById("cell_" + index).classList.add("win-color");
//             }
//             gameOver = true;
//             return myGrid.cells[a];
//         }
//     }
//     if (myGrid.getFreeCellIndex().length === 0) {
//         gameOver = true;
//         return 3;
//     }
//     return 0;
// }

// Check if the game is over and determine winner
function checkWin() {
    winner = 0;

    // rows
    for (let i = 0; i <= 2; i++) {
        const row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] === row[1] && row[0] === row[2]) {
            winner = row[0] === computer ? computer : player;
            if (row[0] == computer) {
                score.computer++;
                winner = computer;
                console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                console.log("player wins");
            }
            const tmpAr = myGrid.getRowIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // columns
    for (let i = 0; i <= 2; i++) {
        const col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] === col[1] && col[0] === col[2]) {
             if (col[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            const tmpAr = myGrid.getColumnIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // diagonals
    for (let i = 0; i <= 1; i++) {
        const diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] === diagonal[1] && diagonal[0] === diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            const tmpAr = myGrid.getDiagIndex(i);
            tmpAr.forEach(index => document.getElementById("cell" + index).classList.add("win-color"));
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // If we haven't returned a winner by now, if the board is full, it's a tie
    if (myGrid.getFreeCellIndex().length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }

    return winner;
}

function showOptions() {
    document.getElementById("rx").checked = player === x;
    document.getElementById("ro").checked = player === o;
    document.getElementById("optionsModal").style.display = "block";
}

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


function askUser(question) {
    document.getElementById("questionText").innerText = question;
    document.getElementById("userFeedback").style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    setTimeout(closeModal, 1400, "winAnnounce");
}

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
