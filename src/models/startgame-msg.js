import WsMessage from "./ws-message";

export default class StartGameMsg extends WsMessage {
  constructor() {
    super("start", null);
  }
}
