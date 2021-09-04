export default class WsMessage {
  constructor(type, data) {
    this.msgType = type
    this.data = data
  }

  toString() {
    return JSON.stringify(this)
  }
}