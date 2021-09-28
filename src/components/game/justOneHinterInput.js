import { Col, Container, Row } from "react-bootstrap";
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

  const shouldVerifyGuess = guess && !guess.userCheck && !guess.isCorrect;

  return (
    <Container id="wordPrompt">
      <Row className="justify-content-center">
        <label>
          <h4>The Word is: "{word}"</h4>
        </label>
      </Row>
      {!hintsSubmitted && (
        <Row className="justify-content-center">
          <input
            className="playerInput input"
            type="text"
            value={hint}
            onChange={handleInputChange}
            placeholder={"submit your hint"}
          />
          <button
            className="button primary"
            id="hintBtn"
            onClick={(e) => onHint(hint)}
          >
            Submit
          </button>
        </Row>
      )}
      {hintsSubmitted && !hintsRevealed && (
        <Row className="justify-content-center">
          <button
            className="button primary"
            type="button"
            onClick={() => onRevealHints()}
          >
            Reveal Hints
          </button>
        </Row>
      )}
      {hintsRevealed && (!guess || (guess.userCheck && !guess.isCorrect)) && (
        <h4>Waiting for a guess...</h4>
      )}
      {shouldVerifyGuess && (
        <>
          <Row className="justify-content-center">
            <label>
              <h4>
                Is <b>{guess.guess}</b> Correct?
              </h4>
            </label>
          </Row>
          <Row className="justify-content-center align-items-center">
            <Col>
              <button
                className="button primary"
                value="Yes"
                onClick={(e) => onGuessCorrect()}
              >
                Yes
              </button>
            </Col>
            <Col>
              <button
                className="button primary"
                id="guessBtn"
                onClick={() => onGuessWrong()}
              >
                No
              </button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
