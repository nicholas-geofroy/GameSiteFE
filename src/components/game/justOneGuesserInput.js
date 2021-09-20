import { useState } from "react";
import { Container, Row } from "react-bootstrap";

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

  const shouldGuess =
    !guessState || (guessState.userCheck && !guessState.isCorrect);
  const wrongGuess =
    guessState && guessState.userCheck && !guessState.isCorrect;

  const rightGuess = guessState && guessState.isCorrect;
  return (
    <Container id="wordPrompt" fluid="md">
      <Row className="justify-content-center">
        <label>
          <h4>You are Guessing the Word</h4>
        </label>
      </Row>
      {hintsRevealed && shouldGuess && (
        <>
          <Row className="justify-content-center">
            <input
              className="playerInput"
              type="text"
              value={guess}
              onChange={handleInputChange}
              placeholder={"make a guess"}
            />
          </Row>
          {hintsRevealed && wrongGuess && (
            <Row>
              <span
                style={{
                  color: "red",
                }}
              >
                Wrong Guess
              </span>
            </Row>
          )}
          <Row className="justify-content-center">
            <button
              className="button primary"
              id="guessBtn"
              onClick={(e) => {
                onGuess(guess);
                setGuess("");
              }}
            >
              Submit
            </button>
          </Row>
        </>
      )}
      {rightGuess && (
        <Row className="justify-content-center">
          <h5>
            <span
              style={{
                color: "green",
              }}
            >
              You Guessed Correctly!
            </span>
          </h5>
        </Row>
      )}
      <Row className="justify-content-center">
        <button className="button primary" onClick={() => onNextRound()}>
          Next Round
        </button>
      </Row>
    </Container>
  );
}
