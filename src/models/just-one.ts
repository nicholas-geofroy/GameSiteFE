interface Guess {
  val: string;
  userCheck: boolean;
  isCorrect: boolean;
}

interface Hint {}

interface JustOneRound {
  guesser: string;
  guesses: Array<Guess>;
  curState: string;
  word: string;
  hints: Record<string, Hint>;
}

interface JustOneGame {
  rounds: Array<JustOneRound>;
  players: Array<string>;
}
