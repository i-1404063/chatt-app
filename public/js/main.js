const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const username = getParameterByName("username", (url = window.location.href));
const room = getParameterByName("room", (url = window.location.href));

const socket = io();

//join chat room
socket.emit("joinRoom", { username, room });

//message from the server
socket.on("message", function (obj) {
  // console.log(obj);
  outputMessage(obj);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//users from server for specific room
socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit the message to the server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Function Area starts here

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">${msg.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function outputRoom(room) {
  roomName.innerText = room;
  roomName.style.background = "#ffffff";
  roomName.style.color = "#000";
  roomName.style.padding = "2px 3px";
  roomName.style.borderRadius = "2px";
}

function outputUsers(users) {
  userList.innerHTML = `
   ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
