import GameActionMsg from "./game-action-msg";

export class GuessMsg extends GameActionMsg {
  constructor(guess) {
    super("Guess", {
      guess,
    });
  }
}

export class HintMsg extends GameActionMsg {
  constructor(hint) {
    super("Hint", {
      hint,
    });
  }
}

export class NextRoundMsg extends GameActionMsg {
  constructor() {
    super("NextRound", {});
  }
}

export class SetDuplicateMsg extends GameActionMsg {
  constructor(hintId) {
    super("SetDuplicate", {
      hint: hintId,
    });
  }
}

export class SetUniqueMsg extends GameActionMsg {
  constructor(hintId) {
    super("SetUnique", {
      hint: hintId,
    });
  }
}

export class RevealHintsMsg extends GameActionMsg {
  constructor() {
    super("RevealHints", {});
  }
}
