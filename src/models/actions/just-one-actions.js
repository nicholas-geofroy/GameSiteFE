import GameActionMsg from "./game-action-msg";

export class GuessMsg extends GameActionMsg {
  constructor(guess) {
    super("guess", guess);
  }
}

export class HintMsg extends GameActionMsg {
  constructor(hint) {
    super("hint", hint);
  }
}

export class NextRoundMsg extends GameActionMsg {
  constructor() {
    super("nextRound", null);
  }
}

export class SetDuplicateMsg extends GameActionMsg {
  constructor(hintId) {
    super("setDuplicate", {
      hintId: hintId,
    });
  }
}

export class SetUniqueMsg extends GameActionMsg {
  constructor(hintId) {
    super("setUnique", {
      hintId: hintId,
    });
  }
}

export class RevealHintsMsg extends GameActionMsg {
  constructor() {
    super("revealHints", null);
  }
}

export class CorrectGuessMsg extends GameActionMsg {
  constructor() {
    super("correctGuess", null);
  }
}

export class WrongGuessMsg extends GameActionMsg {
  constructor() {
    super("wrongGuess", null);
  }
}
