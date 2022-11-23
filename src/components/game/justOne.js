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
  GivingHints: 0,
  RemovingDuplicates: 1,
  Guessing: 2,
  RoundFinished: 3,
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

    const rounds = gameState.rounds;
    const players = gameState.players;
    const roundState = rounds[rounds.length - 1];

    const guesser = roundState.guesser;
    const imGuesser = myId === guesser;

    const curRoundState = ROUND_STATE[roundState.curState];
    const hintsSubmitted = curRoundState > ROUND_STATE.GivingHints;
    const hintsRevealed = curRoundState > ROUND_STATE.RemovingDuplicates;
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
          hintsSubmitted={hintsSubmitted}
          hintsRevealed={hintsRevealed}
        />
      ));

    return (
      <div id="justOneGameView">
        {imGuesser ? (
          <GuesserInput
            hintsRevealed={hintsRevealed}
            guessState={guess}
            onGuess={(guess) => lobbySocket.send(new GuessMsg(guess))}
            onNextRound={() => lobbySocket.send(new NextRoundMsg())}
          />
        ) : (
          <HinterInput
            word={word}
            guess={guess}
            hintsSubmitted={hintsSubmitted}
            hintsRevealed={hintsRevealed}
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
