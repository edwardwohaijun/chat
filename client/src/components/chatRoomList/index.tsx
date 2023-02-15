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
  // console.log("chatRoomList: ", rooms);

  const dispatch = useDispatch();
  let newChatRoom: IChatRoom = { name: "hehe", roomId: "123", members: [] };
  // const ChatRoom = ({ name, roomId, members, lastMsg }: IChatRoom) => {

  return (
    <div>
      {rooms.list.map((r) => (
        <ChatRoom
          key={r.roomId}
          activeRoomId={rooms.activeRoomId}
          room={r}
          setActive={() => dispatch(setActive(r.roomId))}
        />
      ))}

      <div></div>
      <button onClick={() => dispatch(addChatRoom(newChatRoom))}>
        add chatroom
      </button>
    </div>
  );
};

export default ChatRoomList;
