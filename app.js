const express = require("express");
const http = require("http");
const WebSocket = require("ws").Server;
// const app = http.createServer((req, res) => {
// res.write("On the way to being a full snack developer!")
// res.end()
// })
const app = express();
const server = http.createServer(app);
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

// server.on("request", app)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visitors (count INTEGER, time TEXT)`);
});

const countVisitors = () => {
  db.each(`SELECT * FROM visitors`, (error, row) => {
    console.log("row", row);
  });
};

const shutdownDB = () => {
  countVisitors();
  console.log("shutdow db");
  db.close();
};

const ws = new WebSocket({ server });

ws.on("connection", (res) => {
  const clients = ws.clients.size;
  console.log(`client connected ${clients}`);
  ws.broadcast(`Current visitors ${clients}`);
  if (res.readyState === res.OPEN) {
    res.send("Welcome to my server");
  }
  db.run(
    `INSERT INTO visitors (count, time) VALUES (${clients}, datetime('now'))`,
  );
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

process.on("SIGINT", () => {
  ws.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
  process.exit();
});
