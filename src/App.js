import {Client} from 'boardgame.io/client';
import {TicTacToe} from './Game'

class TicTacToeClient{
    constructor(rootElement){
        this.client = Client({game: TicTacToe});
        this.client.start();
        this.rootElement = rootElement
        this.createBoard()
        this.attachListeners()
        
        // Subscribe to a callback everytime the state of the game is changed
        this.client.subscribe(state => this.update(state))
    }

    createBoard(){
        // Create cells in rows for the Tic-Tac-Toe board.
        const rows = [];
        for (let i = 0; i < 3; i++) {
        const cells = [];
        for (let j = 0; j < 3; j++) {
            const id = 3 * i + j;
            cells.push(`<td class="cell" data-id="${id}"></td>`);
        }
        rows.push(`<tr>${cells.join('')}</tr>`);
        }

        // Add the HTML to our app <div>.
        // We’ll use the empty <p> to display the game winner later.
        this.rootElement.innerHTML = `
        <table>${rows.join('')}</table>
        <p class="winner"></p>
        `;
    }

    attachListeners(){
         // This event handler will read the cell id from a cell’s
        // `data-id` attribute and make the `clickCell` move.
        const handleCellClick = event => {
            const id = parseInt(event.target.dataset.id);
            // console.log(event.target.dataset)
            this.client.moves['clickCell'](id);
        }
        
        // Attach the event listener to each of the board cells.
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = handleCellClick;
        });
    }

    update(state){
        console.log('state updated')
        // Get all the board cells.
        const cells = this.rootElement.querySelectorAll('.cell');
        // Update cells to display the values in game state.
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);
            const cellValue = state.G.cells[cellId];
            cell.textContent = cellValue !== null ? cellValue : '';
        });
        // Get the gameover message element.
        const messageEl = this.rootElement.querySelector('.winner');
        // Update the element to show a winner if any.
        if (state.ctx.gameover) {
        messageEl.textContent =
            state.ctx.gameover.winner !== undefined
            ? 'Winner: ' + state.ctx.gameover.winner
            : 'Draw!';
        } else {
        messageEl.textContent = '';
        }
    }
}

const appElement = document.getElementById('app');
const app = new TicTacToeClient(appElement);