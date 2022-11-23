import {
  SetDuplicateMsg,
  SetUniqueMsg,
} from "../../models/actions/just-one-actions";
import { Button } from "react-bootstrap";

function JustOnePlayer(props) {
  const state = props.hintState;
  const hasSubmittedHint = !!state;

  let hint = "";
  let isDuplicate = false;

  let hintElem;

  const onToggleShow = (e) => {
    props.lobbySocket.send(
      state.duplicate
        ? new SetUniqueMsg(props.id)
        : new SetDuplicateMsg(props.id)
    );
  };

  if (hasSubmittedHint) {
    hint = state.val;
    isDuplicate = state.duplicate;

    if (!props.hintsSubmitted) {
      hintElem = "???";
    } else {
      if (props.isGuesser && !props.hintsRevealed) {
        hintElem = "???";
      } else {
        if (isDuplicate) {
          hintElem = <strike>{hint}</strike>;
        } else {
          hintElem = hint;
        }
      }
    }
  } else {
    hintElem = <span className="waitingText">waiting for hint</span>;
  }
  return (
    <div className="playerInfo">
      <div className="playerName">{props.displayName}</div>
      <div className="playerHint">
        {props.hintsSubmitted && !props.isGuesser && (
          <button className="showBtn button secondary" onClick={onToggleShow}>
            {state.duplicate ? "Show" : "Hide"}
          </button>
        )}
        <div className="hintText">{hintElem}</div>
      </div>
    </div>
  );
}

export default JustOnePlayer;
