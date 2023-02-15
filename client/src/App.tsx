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
import { decrement, increment } from "./redux/reducers/countReducer";
import {
  addChatRoom,
  removeChatRoom,
  setActive,
  updateLastMsg,
} from "./redux/reducers/chatRoomList";
import { IChatRoom } from "./types";

function App() {
  const profile = useSelector((state: RootState) => state.profile);
  // console.log("profile: ", profile);

  // const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  // const msgList = useSelector((state: RootState) => state.messageList);
  // console.log("msgList: ", msgList.list);

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
        </div>

        <div className="message-list">
          <ChatWindow
            profile={profile}
            room={activeRoom}
            messageList={msgList}
          />
          {/* <div>
            <button
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <span>{count}</span>
            <button
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
  </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
