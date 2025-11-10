import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/bridge",
  transports: ["websocket"],
  pingInterval: 25000,
  pingTimeout: 20000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env["PORT"] || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Photoshop WebSocket Bridge Server" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on("create_caroussel", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("create_caroussel", data);
  });

  socket.on("photoshop:command", (data) => {
    console.log("Photoshop command received:", data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Photoshop WebSocket Bridge started on port ${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
