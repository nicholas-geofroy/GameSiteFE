import WsMessage from "./ws-message";

export default class PlayMsg extends WsMessage {
  constructor(card) {
    super("play", card);
  }
}
