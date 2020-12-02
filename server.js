const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);
const messageFormat = require("./utils/messages");
const {
  joinUser,
  getCurrentUser,
  removeUser,
  getRoomUsers,
} = require("./utils/users");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);
    // console.log(user);
    socket.join(user.room);
    //it will display the message to the client just joined
    socket.emit("message", messageFormat(user.username, "Welcome to ChatApp"));

    //this message will be broadcasted to all the users connected except the one joined
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormat(user.username, `${user.username} has joined the chat`)
      );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen from the client
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", messageFormat(user.username, msg));
  });

  //when a user leave the chatroom
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        messageFormat(user.username, `${user.username} just left the chat room`)
      );

      // send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`server is listening on: ${port}`));
