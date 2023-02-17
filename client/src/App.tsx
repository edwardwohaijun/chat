import React, { Dispatch, useEffect } from "react";
// import { AppState } from "./redux/reducers/rootReducer";
// import { CountActions } from "./redux/actions/countActions";
// import { NameActions } from "./redux/actions/nameActions";
import "./App.scss";
import AppHeader from "./components/appHeader";
import Sidebar from "./components/sidebar";
import ChatRoomList from "./components/chatRoomList";
import ChatWindow from "./components/chatWindow";

import type { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";

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
      <div className="App-header">
        <AppHeader />
      </div>
      <div className="App-body">
        <Sidebar />

        <div className="chat-list">
          <ChatRoomList />
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
