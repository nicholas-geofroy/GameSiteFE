export default class WsMessage {
  msgType: string;
  data: any;

  constructor(type: string, data: any) {
    this.msgType = type;
    this.data = data;
  }

  toString() {
    return JSON.stringify(this);
  }
}
