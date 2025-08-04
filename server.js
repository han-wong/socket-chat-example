import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.HOSTS || "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`CORS-enabled web server listening on port ${port}`);
  console.log(`HOSTS: ${process.env.HOSTS}`);
});
