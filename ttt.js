console.log('CONNECTED');

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
    const printState = () => console.log(fields);

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

function TttControl(
    playerOne = 'Player One',
    playerTwo = 'Player Two') {

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
        currentTurn
    };
}
const ttt = TttControl();
