import EventEmitter from "events";

type MessageCommand = {
  recipient: string;
  text: string;
};

const messages: MessageCommand[] = [];
const ee = new EventEmitter();

ee.addListener("message", (message: MessageCommand) => {
  messages.push(message);
});

export function SOCKET(
  client: import("ws").WebSocket,
  request: import("http").IncomingMessage,
  server: import("ws").WebSocketServer
) {
  console.log("A client connected!");

  client.on("message", (message) => {
    const cmd = JSON.parse(message.toString()) as MessageCommand;

    ee.emit("message", cmd);
  });

  ee.addListener("message", (message: MessageCommand) => {
    client.send(JSON.stringify(message));
  });

  client.on("close", () => {
    console.log("A client disconnected!");
  });
}
