import io from "socket.io-client";
const socketConnection = io("http://localhost:8000/", {
  path: "/chat/socket.io/",
});
export default socketConnection;
