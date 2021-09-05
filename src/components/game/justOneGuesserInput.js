import { useState } from "react";

export default function GuesserInput({
  hintsRevealed,
  guessState,
  onGuess,
  onNextRound,
}) {
  const [guess, setGuess] = useState("");

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const shouldGuess = !guessState || guessState.userCheck;
  const wrongGuess =
    guessState && guessState.userCheck && !guessState.isCorrect;
  return (
    <div id="wordPrompt">
      <label>
        <h4>You are Guessing the Word</h4>
      </label>
      {hintsRevealed && shouldGuess && (
        <>
          <input
            className="playerInput"
            type="text"
            value={guess}
            onChange={handleInputChange}
            placeholder={"make a guess"}
          />
          {hintsRevealed && wrongGuess && (
            <span
              style={{
                color: "red",
              }}
            >
              Wrong Guess
            </span>
          )}
          <input
            type="submit"
            value="Submit"
            id="guessBtn"
            onClick={(e) => {
              onGuess(guess);
              setGuess("");
            }}
          />
          <button onClick={() => onNextRound()}>Next Round</button>
        </>
      )}
    </div>
  );
}
