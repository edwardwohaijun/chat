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
  activeRoomId: number;
  setActive: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const ChatRoom = ({ room, activeRoomId, setActive }: IChatRoomProps) => {
  let lastMsgBy = "";
  let lastMsg = "";
  let lastMsgSentAt = "";
  if (room.lastMsg) {
    lastMsgBy = room.lastMsg.senderProfile.nickname;
    lastMsg = room.lastMsg.content;
    lastMsgSentAt = room.lastMsg.sentAt;
  }
  return (
    <div
      className={`room-item ${activeRoomId === room.roomId ? "active" : ""}`}
      onClick={setActive}
    >
      <div style={{ width: "20%" }}>
        <Avatar size="large">{room.name[0]}</Avatar>
      </div>
      <div style={{ width: "80%", marginLeft: "8px", paddingRight: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#C9C7D0" }}>{room.name}</div>
          <div
            style={{ color: "#7B798F", fontSize: "small", marginRight: "8px" }}
          >
            {lastMsgSentAt}
          </div>
        </div>
        <div
          style={{
            color: "#7B798F",
            textAlign: "left",
            fontSize: "small",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {lastMsg ? `${lastMsgBy}: ${lastMsg}` : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
