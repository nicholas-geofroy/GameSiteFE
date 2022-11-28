export default class WsMessage {
  msgType: string;
  data: object;

  constructor(type: string, data: object) {
    this.msgType = type;
    this.data = data;
  }

  toString() {
    return JSON.stringify(this);
  }
}
