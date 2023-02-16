import React, { Dispatch, useEffect } from "react";
// import { AppState } from "./redux/reducers/rootReducer";
// import { CountActions } from "./redux/actions/countActions";
// import { NameActions } from "./redux/actions/nameActions";
import "./App.scss";
import Sidebar from "./components/sidebar";
import ChatRoomList from "./components/chatRoomList";
import ChatWindow from "./components/chatWindow";

import type { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";

import { login, logout } from "./services/api";
import socket from "./services/socket";
import { decrement, increment } from "./redux/reducers/countReducer";
import {
  addChatRoom,
  removeChatRoom,
  setActive,
  updateLastMsg,
} from "./redux/reducers/chatRoomList";
import { initialize } from "./redux/reducers/profileList";
import { IChatRoom } from "./types";

function App() {
  const profile = useSelector((state: RootState) => state.profile);

  const chatRoomList = useSelector((state: RootState) => state.chatRoomList);
  const activeRoom = chatRoomList.list.find(
    (r) => r.roomId === chatRoomList.activeRoomId
  );
  const msgList = useSelector(
    (state: RootState) => state.messageList
  ).list.filter((m) => m.roomId === chatRoomList.activeRoomId);

  return (
    <div className="App">
      <header className="App-header">app header</header>
      <div className="App-body">
        <Sidebar />

        <div className="chat-list">
          <ChatRoomList />
          <button onClick={login}>login</button>
        </div>

        <div className="message-list">
          <ChatWindow
            profile={profile}
            room={activeRoom}
            messageList={msgList}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
