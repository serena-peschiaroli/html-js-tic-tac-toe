
//GLOBAL VARIABLES

let moves = 0;
let winner = 0;
let x = 1;
let o = 3;
let player = x;
let computer = 0;
let whoseTurn = x;
let gameOver = false;

let score = {
    ties : 0,
    player : 0,
    computer : 0
}

let xSymbol = "<span class=\"x\">&times;</class>";
let oSymbol= "<span class=\"o\">o</class>";

let playerSymbol = xSymbol;
let computerSymbol = oSymbol;

let myGrid = null;




// GRID OBJECTS

class Grid {
    constructor(){
        this.cells = Array(9).fill(0);
    }

    //obtain the index of the free cells

    getFreeCellIndex(){
        return this.cells.map((cell, index) => (cell === 0 ? index : null)).filter(index => index !== null);
        

    };
    
    

    //obtain row values
    getRowValues(index) {
        if (![0, 1, 2].includes(index)){
            console.error("invalid argument for row values!");
            return undefined;
        }
        return this.cells.slice(index * 3, index * 3 + 3);

    };

    //obtain row index
    getRowIndex(index){
        if(![0, 1, 2].includes(index)) {
            console.error("Invalid argument for row indexes!");
            return undefined;
        }
        return Array.from({length : 3}, (_, i) => index * 3 + i);
    };

    //obtain column values
    getColumnValues(index){
        if(![0, 1, 2].includes(index)){
            console.error("invalid argument for colum values");
            return undefined;
        }

        return [index, index + 3, index + 6].map(i => this.cells[i]);
    }

    getColumnIndex(index){
        if(![0, 1, 2].includes(index)){
            console.error("Invalid argument for column indexes!");
            return undefined;
        }

        return [index, index + 3, index + 6];
    }

    //obtain diagonal values
    // arg 0: from top-left
    // arg 1: from top-right
    getDiagValues(arg){
        if(![0, 1].includes(index)){
            console.error("Invalid argument for diagonal values!");
            return undefined;
        }

        return arg === 0 ? [this.cells[0], this.cells[4], this.cells[8]] : [this.cells[2], this.cells[4], this.cells[6]];
    }

    //obtain diagonal index
    getDiagIndex(arg){
        if(![0, 1].includes(index)){
            console.error("Invalid argument for diagonal indexes!");
            return undefined;
        }

        return arg === 0 ? [0, 4, 8] : [2, 4, 6];

    }

    /*Get first index with two in a row (accepts computer or player as argument)*/
    getFirstWithTwoInARow(agent){
        if(![computer, player].includes(agent)){
            console.error("get first index with two in a row accepts only plaer or computer as argument!");
            return undefined;
        }

        const sum = agent * 2;
        const freeCells = shuffleArray(this.getFreeCellIndex());

        for(const freeCell of freeCells){
            for (const i of [0, 1, 2]){
                const rowV = this.getRowValues(i);
                const rowI = this.getRowIndex(i);
                const colV = this.getColumnValues(i);
                const colI = this.getColumnIndex(i);

                if((sumArray(rowV) === sum && rowI.includes(freeCell)) || (sumArray(colV) === sum && colI.includes(freeCell))){
                    return freeCell;
                }
            }

            for(const j of [0, 1]){
                const diagV = this.getDiagValues(j);
                const diagI = this.getDiagIndex(j);
                if(sumArray(diagV) === sum && diagI.includes(freeCell)){
                    return freeCell;
                }
            }

        }
        return false; 
    }
    reset(){
        this.cells.fill(0);
        return true;
    }



}

//HELPER FUNCTIONS

const sumArray = array => array.reduce((sum, value) => sum + value, 0);

const isInArray = (element, array) => array.includes(element);

const shuffleArray = array => {
    const newArray = array.slice();
    for (let i = newArray.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

const intRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;



//MAIN UFUNCTIONS

function start(){
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player; //default
    myGrid.reset();
    setTimeout(showOptions, 500);
}

//ask player if they want to play as X or O. X goes first

function assignRoles(){
    askUser("Do you want to go first?")
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}



//executed when player clicks one of the cells
//check if the move is valid
function cellClicked(id) {
    //check if cell is already occupied or if player's turn or the game is not over
    const idName = id.toString();
    const cell = parseInt(idName.slice(-1));
    console.log(cell);
    if(myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver ){
        return false;
    }
    //updates move counts
    moves += 1;
    console.log(moves);
    //update cell display
    document.getElementById(id).innerHTML = playerSymbol;

    //marking cell as occupied:
    document.getElementById(id).style.cursor ="default";
    myGrid.cells[cell] = player;
}


