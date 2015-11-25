"use strict";

const ws = require("ws");
const net = require("net");

const WEB_SOCKET_PORT = 9000;
const TCP_PORT = 6080;

exports.listen = () => {
  let wsServer = new ws.Server({ port: WEB_SOCKET_PORT });

  console.log("Listening for WS on *:" + WEB_SOCKET_PORT);
  console.log("Will proxy to TCP on *:" + TCP_PORT + " on first WS connection");

  wsServer.on("connection", wsConnection => {
    let tcpClient = net.connect({ port: TCP_PORT });
    tcpClient.setEncoding("utf8");

    tcpClient.on("connect", () => {
      console.log("TCP connection succeeded");
    });

    tcpClient.on("error", e => {
      wsConnection.close();
      console.log("TCP connection failed: " + e);
    });

    tcpClient.on("data", data => {
      console.log("TCP -> WS: " + data);
      wsConnection.send(data);
    });

    wsConnection.on("message", msg => {
      console.log("WS -> TCP: " + msg);
      tcpClient.write(msg);
    });
  });
};

if (require.main == module) {
  exports.listen();
}
