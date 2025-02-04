console.log('CONNECTED with DOM');

function Tttboard() {
    const size = 3;
    const fields = [];
    for (let i = 0; i < size; i++) {
        fields[i] = [];
        for (let j = 0; j < size; j++) {
            fields[i].push(' ');
        }
    }

    const markField = (field, mark) => {

        const [row, col] = field;
        if (fields[row][col] === ' ') {
            fields[row][col] = mark;
            return true;
        } else return false;
    }
    const printState = () => fields;

    const checkWinner = (field, player) => {
        const [row, col] = field;
        const sign = player.mark;

        let [horizontal, vertical, diagonal, reversediag] = [0, 0, 0, 0];
        let check = false;
        for (let i = 0; i < size; i++) {
            if (fields[row][i] === sign) horizontal++;
            if (fields[i][col] === sign) vertical++;
            if (fields[i][i] === sign) diagonal++;
            if (fields[i][size - i - 1] === sign) reversediag++;
        }
        if (horizontal === size ||
            vertical === size ||
            diagonal === size ||
            reversediag === size) check = true;
        return check;
    }

    return { markField, printState, checkWinner };
}

function TttControl(playerOne = 'Player One', playerTwo = 'Player Two') {

    const board = Tttboard();

    const players = [
        { name: playerOne, mark: 'X' },
        { name: playerTwo, mark: 'O' }
    ];
    let winner = '';
    let currentPlayer = players[0];
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0]
    }
    const getCurrentPlayer = () => currentPlayer;
    const setPlayers = (p1, p2) => { players[0].name = p1; players[1].name = p2 };
    const currentTurn = (choosenField) => {
        console.log(
            `${getCurrentPlayer().name} marked field ${choosenField} with '${getCurrentPlayer().mark}'`);
        if (board.markField(choosenField, getCurrentPlayer().mark)) {
            winner = board.checkWinner(choosenField, getCurrentPlayer()) ? getCurrentPlayer() : '';
            if (winner) {
                console.log(`${getCurrentPlayer().name} WIIIIIN !!!!`);
                return getCurrentPlayer();
            }
            switchPlayer();
        } else { console.log('OOOOPS') };
        board.printState();
        console.log(
            `Next turn: ${getCurrentPlayer().name}`
        )
    };
    return {
        currentTurn,
        getCurrentPlayer,
        setPlayers,
        actualState: board.printState
    };
}

function ScreenControl() {
    const ttt = TttControl();
    const messageBox = document.querySelector('h1');
    const boardBox = document.querySelector('.ttt');
    const inputNames = document.querySelector('form');
    const tttNames = (p1, p2) => ttt.setPlayers(p1, p2);
    const updateScreen = (gameover) => {
        const savedSteps = ttt.actualState();
        const whoIsNext = ttt.getCurrentPlayer();
        boardBox.textContent = '';

        if (!gameover) {
            messageBox.textContent = `Next move: ${whoIsNext.name}`;
        }


        savedSteps.forEach((item, row) => {
            item.forEach((field, col) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.choosen = `${row} ${col}`;
                cellButton.textContent = field;
                boardBox.appendChild(cellButton);
            })
        });
    }
    function userClicked(e) {
        const selectedField = e.target.dataset.choosen;
        let winner;
        if (!selectedField) return;
        winner = ttt.currentTurn(selectedField.split(' '));
        if (!winner) {
            updateScreen(false);
        } else {
            messageBox.textContent = `The Winner is: ${winner.name}`;
            updateScreen(true);
            boardBox.removeEventListener('click', userClicked);
        }
    }
    function userNames(e) {
        if (e.submitter.className === 'newgame') return;
        e.preventDefault();
        console.dir(e);
        console.log(e.target.elements.playerone.value);
        ttt.setPlayers(e.target.elements.playerone.value, e.target.elements.playertwo.value);
        updateScreen(false);
    }
    boardBox.addEventListener('click', userClicked);
    inputNames.addEventListener('submit', userNames);

    updateScreen(false);
}
ScreenControl();
