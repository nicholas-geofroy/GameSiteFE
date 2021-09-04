import WsMessage from "./ws-message"

export default class BetMsg extends WsMessage {
  constructor(amount) {
    super("Bet", Number(amount))
  }
}