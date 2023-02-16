import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import "./chatRoom.scss";
import { IChatRoom } from "../../types";
import {
  addChatRoom,
  removeChatRoom,
  setActive,
  updateLastMsg,
} from "../../redux/reducers/chatRoomList";
import ChatRoom from "./chatRoom";

const ChatRoomList = () => {
  const rooms = useSelector((state: RootState) => state.chatRoomList);
  const dispatch = useDispatch();

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid #454451",
          height: "64px",
          color: "#7B798F",
        }}
      >
        search
      </div>
      {rooms.list.map((r) => (
        <ChatRoom
          key={r.roomId}
          activeRoomId={rooms.activeRoomId}
          room={r}
          setActive={() => dispatch(setActive(r.roomId))}
        />
      ))}
    </div>
  );
};

export default ChatRoomList;
