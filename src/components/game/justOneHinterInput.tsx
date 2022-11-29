import { Col, Container, Row } from "react-bootstrap";
import { ChangeEvent, SyntheticEvent, useState } from "react";

interface HinterInputProps {
  word: string;
  guess?: Guess;
  hintsSubmitted: boolean;
  hintsRevealed: boolean;
  onGuessCorrect: () => void;
  onGuessWrong: () => void;
  onRevealHints: () => void;
  onHint: (hint: string) => void;
}
export default function HinterInput({
  word,
  guess,
  hintsSubmitted,
  hintsRevealed,
  onGuessCorrect,
  onGuessWrong,
  onRevealHints,
  onHint,
}: HinterInputProps) {
  const [hint, setHint] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHint(event.target.value);
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onHint(hint);
    return false;
  };

  const shouldVerifyGuess = guess && !guess.userCheck && !guess.isCorrect;
  const correctGuess = guess && guess.isCorrect;

  return (
    <Container id="wordPrompt">
      <Row className="justify-content-center">
        <label>
          <h4>The Word is: "{word}"</h4>
        </label>
      </Row>
      {!hintsSubmitted && (
        <Row className="justify-content-center" as="form" onSubmit={onSubmit}>
          <input
            className="playerInput input"
            type="text"
            value={hint}
            onChange={handleInputChange}
            placeholder={"submit your hint"}
          />
          <button className="button primary" id="hintBtn" type="submit">
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
                Is <b>{guess.val}</b> Correct?
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
      {correctGuess && <h4>Waiting for next round...</h4>}
    </Container>
  );
}
