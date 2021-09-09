import { Button, Col, Container, Row } from "react-bootstrap";
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
      <Row className="justify-content-md-center">
        <label>
          <h4>The Word is: "{word}"</h4>
        </label>
      </Row>
      {!hintsSubmitted && (
        <Row className="justify-content-md-center">
          <input
            className="playerInput"
            type="text"
            value={hint}
            onChange={handleInputChange}
            placeholder={"submit your hint"}
          />
          <Button id="hintBtn" onClick={(e) => onHint(hint)}>
            Submit
          </Button>
        </Row>
      )}
      {hintsSubmitted && !hintsRevealed && (
        <Row className="justify-content-md-center">
          <Button type="Button" onClick={() => onRevealHints()}>
            Reveal Hints
          </Button>
        </Row>
      )}
      {hintsRevealed && (!guess || (guess.userCheck && !guess.isCorrect)) && (
        <h4>Waiting for a guess...</h4>
      )}
      {shouldVerifyGuess && (
        <>
          <Row className="justify-content-md-center">
            <label>
              <h4>
                Is <b>{guess.guess}</b> Correct?
              </h4>
            </label>
          </Row>
          <Row className="justify-content-center align-items-center">
            <Col>
              <Button
                value="Yes"
                onClick={(e) => onGuessCorrect()}
                className="float-right"
              >
                Yes
              </Button>
            </Col>
            <Col>
              <Button id="guessBtn" onClick={() => onGuessWrong()}>
                No
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
