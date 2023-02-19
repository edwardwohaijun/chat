import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";

import { BsSearch } from "react-icons/bs";

import "./index.scss";
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
      <div className="search-box-wrapper">
        <div className="search-box">
          <div className="icon">
            <BsSearch />
          </div>
          <input className="search-input" placeholder="Search" />
        </div>
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
