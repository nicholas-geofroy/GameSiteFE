import { Component } from "react";

class JustOnePlayer extends Component {
  render() {
    const state = this.props.hintState;
    const hasSubmittedHint = !!state;

    let hint = "";
    let isDuplicate = false;

    let hintElem;

    if (hasSubmittedHint) {
      hint = state.hint;
      isDuplicate = state.isDuplicate;

      if (!this.props.hintsSubmitted) {
        hintElem = "???";
      } else {
        if (this.props.isGuesser && !this.props.hintsRevealed) {
          hintElem = "???";
        } else {
          if (isDuplicate) {
            hintElem = <strike>{hint}</strike>;
          }
          hintElem = hint;
        }
      }
    } else {
      hintElem = "...";
    }
    return (
      <div className="playerInfo">
        <div className="playerName">{this.props.displayName}</div>
        <div className="playerHint">{hintElem}</div>
      </div>
    );
  }
}

export default JustOnePlayer;
