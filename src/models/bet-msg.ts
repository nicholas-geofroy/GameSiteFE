import WsMessage from "./ws-message";

export default class BetMsg extends WsMessage {
  constructor(amount: any) {
    super("bet", Number(amount));
  }
}
