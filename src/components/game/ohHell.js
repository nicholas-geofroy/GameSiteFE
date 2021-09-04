import React, { useState } from 'react';
import Player from './player';
import Loading from '../loading';
import Card from './card';
import Button from 'react-bootstrap/Button';

function isEmpty(obj) {
  for (var i in obj) return false;
  return true;
}

const OhHell = (props) => {
  const [bet, setBet] = useState(0)

  const myId = props.myId
  const state = props.gameState
  const onBet = props.onBet || ((x) => {})
  const onPlay = props.onPlay || ((x) => {})


  console.log("State", state)
  //waiting for initial state
  if (isEmpty(state)) {
    return <Loading />;
  }

  const players = state.players
  const roundState = state.round

  const playerStates = players.reduce((obj, pId, _) => { 
    obj[pId] = { ...state.globalState[pId], ...roundState.playerState[pId] }
    return obj
  }, {})

  const toPlay = players[roundState.nextPlayerIdx]

  const otherPlayers = players.filter(pId => pId != myId).map(pId => {
    return <Player key={pId} pId={pId} shouldPlay={pId == toPlay} state={playerStates[pId]} />
  })

  const myState = playerStates[myId]
  const myTurn = toPlay == myId

  const myHand = myState.hand.map(card => {
    return <Card key={card} val={card} onSelect={myTurn ? onPlay : null}></Card>
  })

  var action = null
  if (myTurn) {
    //my turn to play
    if (myState.bet < 0) {
      //we need to bet first
      const onChange = (e) => {
        setBet(e.target.value)
      }
      action = (
      <div>
        <label htmlFor="bet">Cards You Want To Bet:</label>
        <input type="number" id="bet" name="bet" value={bet}
              min="0" max={roundState.cardsPerPlayer} onChange={onChange}/>
        <Button variant="primary" onClick={() => onBet(bet)}>Bet</Button>
      </div>
      );
    } else {
      action = (
        <h5>Select a card to play:</h5>
      );
    }
  }

  return (<div id="GameContent">
    <div id="opponentInfo">
      <h3>Opponents</h3>
      {otherPlayers}
    </div>
    <div id="myInfo">
      <h3>Me</h3>
      <Player pId={myId} state={myState} />
      {action}
      <h5>Hand</h5>
      {myHand}
    </div>
    <br></br>
    <div id="generalInfo">
      <div id="topCard">
        <b>Top Card:</b> <Card val={roundState.top} notClickable={true}/>
      </div>
    </div>
  </div>);
};

export default OhHell;