import React, { useEffect, useState, Component } from 'react';
import Button from 'react-bootstrap/Button';
import { withRouter } from "react-router";
import { withAuth0 } from '@auth0/auth0-react';

import { backend_url, default_opts, useCreateWs, createWs, makeApiCall } from "../../backend"
import StartGameMsg from "../../models/startgame-msg"
import BetMsg from "../../models/bet-msg"
import Loading from '../loading';
import UserList from './user-list';
import OhHell from "../game/ohHell";
import PlayMsg from '../../models/play-msg';
import JustOne from '../game/justOne';
import GetStateMsg from '../../models/get-state-msg';
import _ from 'underscore';

const lobbyState = {
  SETUP: "setup",
  ATTEMPT_START: "attempt-start",
  IN_GAME: "in-game"

}

const gameType = {
  JUST_ONE: "JustOne",
  OH_HELL: "OhHell",
}

var gameTypeTitle = {}
gameTypeTitle[gameType.JUST_ONE] = "Just One"
gameTypeTitle[gameType.OH_HELL] = "Oh Hell"
gameTypeTitle[""] = "Loading..."

const messageType = {
  MEMBERS: "Members",
  GAME_TYPE: "GameType",
  START_GAME: "StartGame",
  ERROR: "Error",
  GAME_STATE: "GameState"
}

const errorType = {
  NOT_ENOUGH_PLAYERS: "NotEnoughPlayers"
}

const ExistingLobby = () => {
  const [ state, setState ] = useState(lobbyState.SETUP)
  const [ users, setUsers ] = useState([])
  
  const [ gameState, setGameState ] = useState({})
  const [ curGameType, setCurGameType ] = useState("")

  const { user } = useAuth0();
  const userId = user.sub;

  let { lobbyId } = useParams();
  const { loading, error, websocket } = useJoinLobby(lobbyId)

  useEffect(() => {
    if (websocket) {
      console.log("create onmessage function")
      websocket.onmessage = function (event) {
        console.log("received message")
        let message = JSON.parse(event.data)
        console.log("type:", message.msgType)
        console.log("data:", message.data)
        switch(message.msgType) {
          case messageType.MEMBERS:
            setUsers(oldUsers => {
              message.data.users.map(u => u)
            })
            break;
          case messageType.START_GAME:
            console.log("Start game message received")
            setState(lobbyState.IN_GAME)
            websocket.send(new GetStateMsg().toString())
            break;
          case messageType.ERROR:
            console.log("Error", message.data)
            break;
          case messageType.GAME_STATE:
            const state = message.data.state
            console.log("game state message received. state:", state)
            setGameState(state)
            setState(lobbyState.IN_GAME)
            break;
          case messageType.GAME_TYPE:
            console.log("GameType message received")
            console.log("New game type: " + message.data.gameType)
            setCurGameType(message.data.gameType)
            break;
          default:
            console.log("Unknown message: ", message)
            break;
        }
      }

      function cleanup() {
        console.log("cleanup websocket")
        websocket.close()
      }
      return cleanup;
    }
  }, [websocket])

  useEffect((() => {
    if (state === lobbyState.ATTEMPT_START && websocket) {
      console.log("Request Start Game")
      websocket.send(new StartGameMsg().toString())
    }
  }), [state, websocket])

  if (loading) {
    return <Loading/>
  }
  if (error) {
    return <div>{error.error}</div>
  }

  
  if (state === lobbyState.IN_GAME) {
    if (curGameType == gameType.OH_HELL) {
      const onBet = (bet) => {
        const msg = new BetMsg(bet).toString()
        console.log(`Betting ${bet} tricks`)
        console.log("message", msg)
        websocket.send(msg)
      }
      const onPlay = (card) => {
        const msg = new PlayMsg(card).toString()
        console.log("Playing", card)
        websocket.send(msg)
      }
  
      return <OhHell myId={userId} gameState={gameState} onBet={onBet} onPlay={onPlay}/>
    } else if (curGameType == gameType.JUST_ONE) {
      return <JustOne
        myId={userId}
        gameState={gameState}
      />
    } else {
      return <div>Unknown Game Type</div>
    }
  }
  
  const handleStartClick = () => {
    setState(lobbyState.ATTEMPT_START);
    console.log("Attempt Start")
  }
  const gameTitle = gameTypeTitle[curGameType]
  return (
    <div id="Lobby">
      <h2>{gameTitle} Lobby</h2>
      <h4>Members</h4>
      <UserList users={users}></UserList>
      <Button variant="primary" onClick={handleStartClick}>Start Game</Button>
    </div>
  );
};

export default ExistingLobby;