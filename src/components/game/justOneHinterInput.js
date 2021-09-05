import { useState } from "react";

export default function HinterInput({
  word,
  guess,
  hintsSubmitted,
  hintsRevealed,
  onGuessCorrect,
  onGuessWrong,
  onRevealHints,
  onHint,
}) {
  const [hint, setHint] = useState("");

  const handleInputChange = (event) => {
    setHint(event.target.value);
  };

  return (
    <div id="wordPrompt">
      <label>
        <h4>The Word is: "{word}"</h4>
      </label>
      {!hintsSubmitted && (
        <>
          <input
            className="playerInput"
            type="text"
            value={hint}
            onChange={handleInputChange}
            placeholder={"submit your hint"}
          />
          <input
            type="submit"
            value="Submit"
            id="hintBtn"
            onClick={(e) => onHint(hint)}
          />
        </>
      )}
      {hintsSubmitted && !hintsRevealed && (
        <>
          <button type="Button" onClick={() => onRevealHints()}>
            Reveal Hints
          </button>
        </>
      )}
      {hintsRevealed && (!guess || (guess.userCheck && !guess.isCorrect)) && (
        <h4>Waiting for a guess...</h4>
      )}
      {guess && !guess.userCheck && (
        <>
          <label>
            <h4>
              Is <b>{guess.guess}</b> Correct?
            </h4>
          </label>
          <button value="Yes" onClick={(e) => onGuessCorrect()}>
            Yes
          </button>
          <button id="guessBtn" onClick={() => onGuessWrong()}>
            No
          </button>
        </>
      )}
    </div>
  );
}
