import WsMessage from "../ws-message";

export default class GameActionMsg extends WsMessage {
  constructor(actionType, data) {
    super("gameMove", {
      actionType,
      data,
    });
  }
}
