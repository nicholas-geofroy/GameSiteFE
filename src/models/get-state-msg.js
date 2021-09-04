import WsMessage from "./ws-message"

export default class GetStateMsg extends WsMessage {
  constructor() {
    super("GetState", {})
  }
}