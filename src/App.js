import { GameLobby } from './Lobby';
import { TicTacToeClient } from './TicTacToeClient'


const appElement = document.getElementById('app');
// const playerIDs = ['0']


// const clients = playerIDs.map(playerID => {
//     const rootElement = document.createElement('div')
//     appElement.append(rootElement)
//     return new TicTacToeClient(rootElement, {playerID})
// })

let lobby = new GameLobby("http://localhost:8000")

let createGame = async() => await lobby.createGame('tic-tac-toe', 2, 3)

let disp = async() => await lobby.displayGames();


// createGame()

disp();