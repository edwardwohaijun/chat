import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import "./App.scss";
import { Avatar, Space } from "antd";
import { IChatRoom } from "../../types";
import {
  addChatRoom,
  removeChatRoom,
  setActive,
  updateLastMsg,
} from "../../redux/reducers/chatRoomList";

interface IChatRoomProps {
  room: IChatRoom;
  activeRoomId: string;
  setActive: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const ChatRoom = ({ room, activeRoomId, setActive }: IChatRoomProps) => {
  return (
    <div
      className={`room-item ${activeRoomId === room.roomId ? "active" : ""}`}
      onClick={setActive}
    >
      <div style={{ width: "20%" }}>
        <Avatar size="large">{room.name[0]}</Avatar>
      </div>
      <div style={{ width: "80%", marginLeft: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#C9C7D0" }}>{room.name}</div>
          <div style={{ color: "#7B798F" }}>
            {room.lastMsg !== null
              ? room.lastMsg?.sentAt.toLocaleTimeString()
              : ""}
          </div>
        </div>
        <div style={{ color: "#7B798F", textAlign: "left" }}>
          {room.lastMsg !== null ? room.lastMsg?.content : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
