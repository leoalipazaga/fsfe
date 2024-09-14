const express = require("express");
const http = require("http");
const WebSocket = require("ws").Server;
// const app = http.createServer((req, res) => {
// res.write("On the way to being a full snack developer!")
// res.end()
// })
const app = express();
const server = http.createServer(app);

// server.on("request", app)

const ws = new WebSocket({ server });

ws.on("connection", (res) => {
  const clients = ws.clients.size;
  console.log(`client connected ${clients}`);
  ws.broadcast(`Current visitors ${clients}`);
  if (res.readyState === res.OPEN) {
    res.send("Welcome to my server");
  }
  res.on("close", () => {
    console.log("A client has disconnected");
  });
});

ws.broadcast = (data) => {
  ws.clients.forEach((client) => {
    client.send(data);
  });
};

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.listen(3000, () => {
  console.log("Server started");
});
