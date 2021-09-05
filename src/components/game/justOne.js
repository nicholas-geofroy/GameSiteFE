import { Component } from "react";
import JustOnePlayer from "./justOnePlayer";
import {
  GuessMsg,
  HintMsg,
  RevealHintsMsg,
} from "../../models/actions/just-one-actions";
import _ from "underscore";
import "./justOneStyle.css";

const ROUND_STATE = {
  waitingForHints: 0,
  hintsSubmitted: 1,
  hintsRevealed: 2,
};

class JustOne extends Component {
  constructor(props) {
    console.log("Just One Constructor");
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getSubmitFunction = this.getSubmitFunction.bind(this);
    this.state = {
      input: "",
    };

    var usersMap = {};
    this.props.users.forEach(
      ({ id, displayName }) => (usersMap[id] = displayName)
    );
    this.usersMap = usersMap;
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value,
    });
  }

  getSubmitFunction(isGuesser) {
    return (event) => {
      console.log("User has submitted a guess/hint");
      event.preventDefault();
      const input = this.state.input;
      this.props.lobbySocket.send(
        isGuesser ? new GuessMsg(input) : new HintMsg(input)
      );
    };
  }

  render() {
    const myId = this.props.myId;
    const gameState = this.props.gameState;

    if (!gameState || _.isEmpty(gameState)) {
      return <div>loading...</div>;
    }

    const roundStates = gameState.roundStates;
    const players = gameState.players;
    const roundState = roundStates[roundStates.length - 1];

    const guesser = roundState.guesser;
    const imGuesser = myId === guesser;

    const curRoundState = roundState.hintsRevealed
      ? ROUND_STATE.hintsRevealed
      : roundState.hintsSubmitted
      ? ROUND_STATE.hintsSubmitted
      : ROUND_STATE.waitingForHints;

    const acceptingInput =
      (imGuesser && curRoundState === ROUND_STATE.hintsRevealed) ||
      (!imGuesser && curRoundState === ROUND_STATE.waitingForHints);

    const word = roundState.word;

    let wordPrompt = (
      <form onSubmit={this.getSubmitFunction(guesser === myId)} id="wordPrompt">
        <label>
          <h4>
            {imGuesser
              ? "You are Guessing the Word"
              : `Secret Word is: ${word}`}
          </h4>
        </label>
        {acceptingInput && (
          <>
            <input
              className="playerInput"
              type="text"
              value={this.state.input}
              onChange={this.handleInputChange}
              placeholder={imGuesser ? "make a guess" : "type a hint"}
            />
            <input type="submit" value="Submit" id="guessBtn" />
          </>
        )}
      </form>
    );

    let revealHintsPrompt = null;
    if (myId !== guesser && curRoundState === ROUND_STATE.hintsSubmitted) {
      revealHintsPrompt = (
        <>
          <button
            type="Button"
            onClick={() => this.props.lobbySocket.send(new RevealHintsMsg())}
          >
            Reveal Hints
          </button>
        </>
      );
    }

    const playerInfos = players
      .filter((p) => p !== guesser)
      .map((id) => (
        <JustOnePlayer
          key={id}
          id={id}
          lobbySocket={this.props.lobbySocket}
          displayName={this.usersMap[id]}
          isGuesser={myId === guesser}
          hintState={roundState.hints[id]}
          hintsSubmitted={roundState.hintsSubmitted}
          hintsRevealed={roundState.hintsRevealed}
        />
      ));

    return (
      <div id="justOneGameView">
        {wordPrompt}
        {revealHintsPrompt}
        <ul id="playerList">{playerInfos}</ul>
      </div>
    );
  }
}

export default JustOne;
