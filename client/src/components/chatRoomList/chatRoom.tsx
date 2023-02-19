import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import "./chatRoom.scss";
import { Avatar, Badge } from "antd";
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
  const profile = useSelector((state: RootState) => state.profile);
  const mentioned =
    room.lastMsg?.mentions?.findIndex((m) => m == profile.userId) !== -1;

  let lastMsgBy = "";
  let lastMsg = "";
  let lastMsgSentAt = "";
  if (room.lastMsg) {
    lastMsgBy = room.lastMsg.senderProfile.nickname;
    lastMsg = room.lastMsg.content;
    lastMsgSentAt = room.lastMsg.sentAt;
    if (mentioned) {
      lastMsg = "You are mentioned.";
    }
  }

  return (
    <div
      className={`room-item ${activeRoomId === room.roomId ? "active" : ""}`}
      onClick={setActive}
    >
      <div style={{ width: "20%" }}>
        <Badge count={room.unreadCount}>
          <Avatar size="large">{room.name[0]}</Avatar>
        </Badge>
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
        <div className={`last-msg ${mentioned ? "mentioned" : ""}`}>
          {lastMsg ? `${lastMsgBy}: ${lastMsg}` : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
