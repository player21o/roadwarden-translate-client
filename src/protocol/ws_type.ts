export class WsType {
  public ws: WebSocket;
  private message_queue: Uint8Array[] = [];

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.message_queue.forEach((message) => {
        this.send(message);
      });
    };
  }

  public send(data: Uint8Array) {
    if (this.ws.readyState == WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.message_queue.push(data);
    }
  }
}
