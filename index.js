const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const port = process.env.PORT || 4000;
// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use(express.json());

app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(port, () => {
  console.log(`Sakib Bhai  listening on port ${port}`);
});
