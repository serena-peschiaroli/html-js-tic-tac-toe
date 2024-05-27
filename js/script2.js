        const cells = Array(9).fill(null);
        let currentPlayer = 'X';
        let gameActive = true;

        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        const gameBoard = document.getElementById('gameBoard');

        const checkWin = () => {
            for (const combination of winningCombinations) {
                const [a, b, c] = combination;
                if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                    combination.forEach(index => document.getElementById('cell' + index).classList.add('win'));
                    gameActive = false;
                    return cells[a];
                }
            }
            return null;
        };

        const handleClick = (event) => {
            const cellIndex = event.target.id.replace('cell', '');
            if (cells[cellIndex] || !gameActive) return;

            cells[cellIndex] = currentPlayer;
            event.target.textContent = currentPlayer;

            if (checkWin()) {
                alert(currentPlayer + ' wins!');
                return;
            }

            if (!cells.includes(null)) {
                alert('Draw!');
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        };

        const restartGame = () => {
            cells.fill(null);
            currentPlayer = 'X';
            gameActive = true;
            for (let i = 0; i < 9; i++) {
                const cell = document.getElementById('cell' + i);
                cell.textContent = '';
                cell.classList.remove('win');
            }
        };

        for (let i = 0; i < 9; i++) {
            document.getElementById('cell' + i).addEventListener('click', handleClick);
        }

        document.getElementById('restart').addEventListener('click', restartGame);