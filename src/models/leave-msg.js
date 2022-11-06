import WsMessage from "./ws-message";

export default class LeaveMsg extends WsMessage {
  constructor() {
    super("leave", {});
  }
}
