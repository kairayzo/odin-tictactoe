var game = (function(){

    const tile1 = document.getElementById('tile1')
    const tile2 = document.getElementById('tile2')
    const tile3 = document.getElementById('tile3')
    const tile4 = document.getElementById('tile4')
    const tile5 = document.getElementById('tile5')
    const tile6 = document.getElementById('tile6')
    const tile7 = document.getElementById('tile7')
    const tile8 = document.getElementById('tile8')
    const tile9 = document.getElementById('tile9')
    const tiles = document.getElementsByClassName('tile')
    const setting = document.getElementById('setting')
    const startBtn = document.getElementById('start')
    const pvpBtn = document.getElementById('pvp')
    const pveBtn = document.getElementById('pve')
    const messageContainer = document.getElementById('message-container')
    const message = document.getElementById('message')

    var gameBoard = (function(){
        let array = [
            ['1','2','3'],
            ['4','5','6'],
            ['7','8','9']]

        function getArray() {
            return array
        }
        
        function addToArray(piece, tile, board = array) {
            const index = board.flat().indexOf(tile);
            const arrF = board.flat()
            if (index !== -1) {
                arrF[index] = piece;
                const newArr = []
                while(arrF.length){
                    newArr.push(arrF.splice(0,3));
                }
                array = newArr
            }
        }

        function evaluateBoard(board = array){
            const arrF = board.flat()
            const spaceRemaining = arrF.filter(function(x){return ['1','2','3','4','5','6','7','8','9'].includes(x)})
            if(spaceRemaining == false) {
                return 'draw'
            }

            function transpose(board) {
                let newBoard = [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]]
                for (let i = 0; i < 3; i++){
                    for (let j = 0; j < 3; j++) {
                        newBoard[j][i] = board[i][j]
                    }
                }
                return newBoard
            }
            function diagonal(board) {
                let diag1 = []
                for (let i = 0; i < 3; i++) {
                    diag1.push(board[i][i])
                }
                let diag2 = []
                let j = 2
                for (let i = 0; i < 3; i++) {
                    diag2.push(board[i][j])
                    j --
                }
                return [diag1, diag2]
            }

            let searchArray = array.concat(transpose(array))
            searchArray = searchArray.concat(diagonal(array))
            

            function triple(arr) {
                return arr[0] === arr[1] && arr[1] == arr[2]
            }

            for (let i = 0; i < searchArray.length; i++) {
                if (triple(searchArray[i])) {
                    return searchArray[i][0]
                }
            }
            return false
        }

        function reset() {
            array = [
                ['1','2','3'],
                ['4','5','6'],
                ['7','8','9']]
            tile1.innerHTML = 1
            tile2.innerHTML = 2
            tile3.innerHTML = 3
            tile4.innerHTML = 4
            tile5.innerHTML = 5
            tile6.innerHTML = 6
            tile7.innerHTML = 7
            tile8.innerHTML = 8
            tile9.innerHTML = 9
            displayController.playRound()

        }
        return {getArray, addToArray, evaluateBoard, reset}
    })()
    
    var displayController = (function(){
        let playerX
        let playerO
        let turn


        const selectedOptn = (pvpBtn,pveBtn) => {
            if (pvpBtn.checked) {
                return 'player'
            } else if (pveBtn.checked) {
                return 'computer'
            }
        }
        
        function saveSettings(selectedOptn) {
            gameBoard.reset()
            playerX = playerFactory('player')
            playerO = playerFactory(selectedOptn)
            playRound()
        }
        
        startBtn.addEventListener('click', (e)=> (saveSettings(selectedOptn(pvpBtn,pveBtn))))
        
        function btnClickHandler(e){
            playTurn(e.target,turn)
        }

        function checkBtnHTML(e){
            if (e.innerHTML != "X" && e.innerHTML != "O") {
                e.style = "cursor: pointer"
            } else {
                e.style = "cursor: not-allowed"
            }
        }


        function enableBtns(state) {
            for (let i = 0; i < tiles.length; i++ ) {
                checkBtnHTML(tiles[i])
            }
            if (state) {
                tile1.addEventListener('click',btnClickHandler)
                tile2.addEventListener('click',btnClickHandler)
                tile3.addEventListener('click',btnClickHandler)
                tile4.addEventListener('click',btnClickHandler)
                tile5.addEventListener('click',btnClickHandler)
                tile6.addEventListener('click',btnClickHandler)
                tile7.addEventListener('click',btnClickHandler)
                tile8.addEventListener('click',btnClickHandler)
                tile9.addEventListener('click',btnClickHandler)
            } else {
                tile1.removeEventListener('click',btnClickHandler)
                tile2.removeEventListener('click',btnClickHandler)
                tile3.removeEventListener('click',btnClickHandler)
                tile4.removeEventListener('click',btnClickHandler)
                tile5.removeEventListener('click',btnClickHandler)
                tile6.removeEventListener('click',btnClickHandler)
                tile7.removeEventListener('click',btnClickHandler)
                tile8.removeEventListener('click',btnClickHandler)
                tile9.removeEventListener('click',btnClickHandler)
            }
        }

        function playTurn(elem, symbol) {
            if (elem.innerHTML != 'X' && elem.innerHTML != 'O') {
                elem.innerHTML = symbol
                elem.style = 'cursor: not-allowed'
                gameBoard.addToArray(turn,elem.id.slice(4))
                const roundWinner = gameBoard.evaluateBoard()
                if (roundWinner) {
                    return endRound(roundWinner)
                } else {
                    enableBtns(false)
                    turn = (turn == 'X') ? 'O' : 'X'
                    if (playerO.getVariant() == 'computer' && turn == 'O') {
                        let bestMove = generateMove(gameBoard.getArray())
                        let bestTile = document.getElementById(`tile${(bestMove.row*3)+1+bestMove.col}`)
                        playTurn(bestTile,'O')
                    }
                    enableBtns(true)
                }
            }
        }

        function generateMove(board) {
            res = null
            player = 'O'
            opponent = 'X'
            let INFIN = 9999

            class Move {
                    constructor() {
                        let row,col;
                    }
            }

            function isMovesLeft(board) {
                for (let i=0; i<3; i++) {
                    for (let j=0; j<3; j++) {
                        if (board[i][j] != player && board[i][j] != opponent) {
                            return true
                        }
                    }
                }
                return false
            }

            function evaluate(board) {
                for (let row = 0; row < 3; row ++) {
                    if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
                        if (board[row][0] == player)
                            return +10;
                        else if (board[row][0] == opponent) {
                            return -10;
                        }
                    }
                }

                for (let col=0; col<3; col++) {
                    if (board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
                        if (board[0][col] == player)
                            return +10;
                        else if (board[0][col] == opponent) {
                            return -10;
                        }
                    }
                }
                if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
                    if (board[0][0] == player) {
                        return +10
                    } else if (board[0][0] == opponent) {
                        return -10
                    }
                }
                if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
                    if (board[0][2] == player) {
                        return +10
                    } else if (board[0][2] == opponent) {
                        return -10
                    }
                } 
                return 0
                
            }

            function minimax(board, depth, isMax) {
                let score = evaluate(board);

                if (score == 10) {
                    return score - depth;
                }
                if (score == -10) {
                    return score + depth;
                }
                if (isMovesLeft(board) == false) {
                    return 0
                }

                if (isMax) {
                    let best = -INFIN
                    for (let i=0; i<3; i++) {
                        for (let j=0; j<3; j++) {
                            if (board[i][j] !== player && board[i][j] !== opponent) {
                                board[i][j] = player;
                                best = Math.max(best, minimax(board, depth + 1, !isMax));
                                board[i][j] = `${(i*3)+1+j}`
                            }
                        }
                    }
                    return best
                } else {
                    let best = INFIN
                    for (let i=0; i<3; i++) {
                        for (let j=0; j<3; j++) {
                            if (board[i][j] !== player && board[i][j] !== opponent) {
                                board[i][j] = opponent;
                                best = Math.min(best, minimax(board, depth + 1, !isMax));
                                board[i][j] = `${(i*3)+1+j}`
                            }
                        }
                    }
                    return best
                }
            }

            function findBestMove(board) {
                let bestVal = -INFIN
                let bestMove = new Move()
                bestMove.row = -1
                bestMove.col = -1

                for (let i=0; i<3; i++) {
                    for (let j=0; j<3; j++) {
                        if (board[i][j] !== player && board[i][j] !== opponent) {
                            board[i][j] = player
                            let moveVal = minimax(board, 0, false)
                            board[i][j] = `${(i*3)+1+j}`

                            if (moveVal > bestVal) {
                                bestMove.row = i
                                bestMove.col = j
                                bestVal = moveVal
                            }
                        }
                    }
                }
                
                return bestMove
            }
            let bestMove = findBestMove(board)
            return bestMove
        }

        function playRound() {
            turn = 'X'
            setting.style.display = 'none'
            message.style.display = 'none'
            messageContainer.style.display = 'none'
            enableBtns(true)
        }
    
        function endRound(roundWinner){
            if (roundWinner == 'X'){
                message.innerHTML = 'X wins'
            } else if (roundWinner == 'O'){
                message.innerHTML = 'O wins'
            } else {
                message.innerHTML = 'Draw'
            }
            startBtn.innerHTML = 'Play Again'
            setting.style.display = 'block'
            message.style.display = 'block'
            messageContainer.style.display = 'flex'
            enableBtns(false)
        }
        
        return {enableBtns, playRound, endRound}

    })()
    
    function playerFactory(variant) {
        if (variant == 'computer') {

        }
        let score = 0
        const addScore = () => {
            score += 1
        } 
        const getScore = () => {
            return score
        }
        const getVariant = () => {
            return variant
        }
        return {addScore, getScore, getVariant}
    }
})()