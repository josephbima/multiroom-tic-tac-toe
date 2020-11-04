import { LobbyClient } from 'boardgame.io/client';
import { TicTacToeClient } from './TicTacToeClient';
import Router from './Router';

const router = new Router({
    mode: 'hash',
    root: '/'
});

class GameLobby{
    constructor(addr){
        this.lobbyClient = new LobbyClient({ server: addr });        
    }

    async getGames(){
        let game_server = undefined
        await this.lobbyClient.listGames()
            .then(data => {game_server = data});
    
        //console.log(game_server)
        return game_server
    }

    async createGame(gameName, numPlayer, numGames = 1){

        for(let i = 0;i <= numGames; i++){
            const { matchID } = await this.lobbyClient.createMatch(gameName, {
                numPlayers: numPlayer
            }); 
        }
    }
    
    async displayGames(){
        let games = await this.getGames()
        games.map((game) => {
            const rootElement = document.createElement('div')
            rootElement.setAttribute("id", game)
            const p = document.createElement('p')
            p.innerHTML = game
            rootElement.appendChild(p)
            document.getElementById('games').append(rootElement)
            this.displayMatches(game)
        })

        // const { matchID } = await this.lobbyClient.createMatch('tic-tac-toe', {
        //     numPlayers: 2
        // });       

        //console.log('matches',  matches)
    }

    async getMatches(gameName){
        let matches = undefined
        await this.lobbyClient.listMatches(gameName)
                            .then(data => {matches = data})
        return matches
    }

    async displayMatches(gameName){
        let matches = await this.getMatches(gameName)
        console.log('Matches', matches.matches)

        const gameElement = document.getElementById(gameName)
        let ul = document.createElement('ul')
        ul.setAttribute("id", gameName + '-matches')
        gameElement.appendChild(ul)

        matches.matches.map((match) => {
            let matchID = match.matchID
            let url = gameName+'/'+matchID
            
            let li = document.createElement('li')
            let a = document.createElement('a')

            
            // Display board after click
            

            router.add(url, () => {
                console.log('eh')
                const appElement = document.getElementById('app');
                this.splashScreen(appElement).then(async player_ID => {
                    const { playerCredentials } = await this.lobbyClient.joinMatch(
                        gameName,
                        matchID,
                        {
                          playerID: player_ID,
                          playerName: player_ID,
                        }
                    );
                    console.log("Creds", playerCredentials)
                    console.log("matchID", matchID)
                    return new TicTacToeClient(appElement, { player_ID }, matchID);
                });

            })
           
            a.innerHTML = 'Match ID: '+ matchID
            a.setAttribute("href", '#/'+url)
            a.setAttribute("id", matchID)
            li.appendChild(a)
            ul.appendChild(li)
        })
    }

    splashScreen(rootElement){
        return new Promise(resolve => {
            const createButton = playerID => {
                const button = document.createElement('button')
                button.textContent = 'Player ' + playerID
                button.onclick = () => {resolve(playerID)}
                rootElement.append(button)
            }
            let playerIDs = ['0','1']
            playerIDs.forEach(createButton)
        })
    }
}

export default GameLobby;