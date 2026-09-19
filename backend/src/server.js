require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const createChatRouter = require("./routes/chat");
const authRouter = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/chat", createChatRouter(io));

io.on("connection", (socket) => {
  socket.on("group:join", (groupId) => {
    const id = Number(groupId);
    if (Number.isInteger(id) && id > 0) socket.join(`group:${id}`);
  });
  socket.on("group:leave", (groupId) => {
    const id = Number(groupId);
    if (Number.isInteger(id) && id > 0) socket.leave(`group:${id}`);
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`StudentHUB chat API running on port ${PORT}`));
}

module.exports = { app, server, io };
