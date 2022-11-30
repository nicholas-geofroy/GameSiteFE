import WsMessage from "./ws-message";

export default class GetGameTypeMsg extends WsMessage {
  constructor() {
    super("getGameType", null);
  }
}
