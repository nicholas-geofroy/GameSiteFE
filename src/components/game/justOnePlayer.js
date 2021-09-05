import {
  SetDuplicateMsg,
  SetUniqueMsg,
} from "../../models/actions/just-one-actions";

function JustOnePlayer(props) {
  const state = props.hintState;
  const hasSubmittedHint = !!state;

  let hint = "";
  let isDuplicate = false;

  let hintElem;

  const onToggleShow = (e) => {
    props.lobbySocket.send(
      state.isDuplicate
        ? new SetUniqueMsg(props.id)
        : new SetDuplicateMsg(props.id)
    );
  };

  if (hasSubmittedHint) {
    hint = state.hint;
    isDuplicate = state.isDuplicate;

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
    hintElem = "...";
  }
  return (
    <div className="playerInfo">
      <div className="playerName">{props.displayName}</div>
      {props.hintsSubmitted && !props.isGuesser && (
        <button className="showBtn" onClick={onToggleShow}>
          {state.isDuplicate ? "Show" : "Hide"}
        </button>
      )}
      <div className="playerHint">{hintElem}</div>
    </div>
  );
}

export default JustOnePlayer;
