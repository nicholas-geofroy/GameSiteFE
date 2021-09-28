import { Component } from "react";
import JustOnePlayer from "./justOnePlayer";
import {
  GuessMsg,
  HintMsg,
  RevealHintsMsg,
  CorrectGuessMsg,
  WrongGuessMsg,
  NextRoundMsg,
} from "../../models/actions/just-one-actions";
import _ from "underscore";
import "./justOneStyle.css";
import GuesserInput from "./justOneGuesserInput";
import HinterInput from "./justOneHinterInput";

const ROUND_STATE = {
  waitingForHints: 0,
  hintsSubmitted: 1,
  hintsRevealed: 2,
};

class JustOne extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getSubmitWordFunction = this.getSubmitWordFunction.bind(this);
    this.state = {
      input: "",
    };
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value,
    });
  }

  getSubmitWordFunction(isGuesser) {
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

    const lobbySocket = this.props.lobbySocket;

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

    const guessSubmitted = roundState.guesses.length > 0;
    const guess = _.isEmpty(roundState.guesses)
      ? null
      : _.last(roundState.guesses);

    const word = roundState.word;

    const playerInfos = players
      .filter((p) => p !== guesser)
      .map((id) => (
        <JustOnePlayer
          key={id}
          id={id}
          lobbySocket={this.props.lobbySocket}
          displayName={this.props.users[id].displayName}
          isGuesser={myId === guesser}
          hintState={roundState.hints[id]}
          hintsSubmitted={roundState.hintsSubmitted}
          hintsRevealed={roundState.hintsRevealed}
        />
      ));

    return (
      <div id="justOneGameView">
        {imGuesser ? (
          <GuesserInput
            hintsRevealed={curRoundState === ROUND_STATE.hintsRevealed}
            guessState={guess}
            onGuess={(guess) => lobbySocket.send(new GuessMsg(guess))}
            onNextRound={() => lobbySocket.send(new NextRoundMsg())}
          />
        ) : (
          <HinterInput
            word={word}
            guess={guess}
            hintsSubmitted={roundState.hintsSubmitted}
            hintsRevealed={roundState.hintsRevealed}
            onGuessCorrect={() => lobbySocket.send(new CorrectGuessMsg())}
            onGuessWrong={() => lobbySocket.send(new WrongGuessMsg())}
            onRevealHints={() => lobbySocket.send(new RevealHintsMsg())}
            onHint={(hint) => lobbySocket.send(new HintMsg(hint))}
          />
        )}
        <ul id="playerList">{playerInfos}</ul>
      </div>
    );
  }
}

export default JustOne;
