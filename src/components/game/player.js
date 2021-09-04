import React from 'react';

const Player = (props) => {
  const id = props.pId
  const state = props.state
  console.log(`Player State for player ${id}`, state)
  const {points, bet, tricks} = state
  const shouldPlay = !!props.shouldPlay

  const hasBet = bet >= 0

  return (<div>
    <div className="playerName">Player {id}</div>
    <div className="points">Points: {points}</div>
    <div className="bet">Bet: {hasBet ? bet : "?"}</div>
    <div className="trocks">Tricks Taken: {tricks}</div>
    {shouldPlay ? <div>Deciding...</div> : <div></div>}
  </div>)
}

export default Player