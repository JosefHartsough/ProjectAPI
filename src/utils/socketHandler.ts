import { WebSocketServer } from "ws";
import { WEBSOCKET_PORT } from "./../config/index";

class SocketHandler {
  public wss = new WebSocketServer({ port: WEBSOCKET_PORT });

  public test() {
    this.wss.on("connection", function connection(ws) {
      ws.on("message", function message(data) {
        console.log("received: %s", data);
      });

      ws.send("somethinddasdssadasddfsds");

      ws.on("close", (code, reason) => {
        console.log(code, reason);
      });

      //   for (let i = 0; i < 1000; i += 1) {
      //   }
      //   while (true) {
      //   }
    });
  }

  public testSend() {
    this.wss.on("");
  }
}

export default SocketHandler;
