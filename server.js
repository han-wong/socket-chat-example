import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.HOSTS || "*");
});

// console.log(path)

// const publicDirectoryPath = path.join(
//   new URL(".", import.meta.url).pathname.substring(1)
// );

// app.use(express.static(publicDirectoryPath));

// app.get("*", (req, res) => {
//   const indexPath = path.resolve(publicDirectoryPath, "index.html");
//   res.sendFile(indexPath);
//   // res.type("html").send(html)
// });

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
