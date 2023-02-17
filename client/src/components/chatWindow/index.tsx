import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { Avatar } from "antd";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { IMessageList, IChatRoom, IMessage, IProfile } from "../../types";
import {
  initializeMessageList,
  addMessage,
} from "../../redux/reducers/messageList";
import { initializeProfileList } from "../../redux/reducers/profileList";
import {
  updateLastMsg,
  initializeChatRooms,
  updateUnreadCount,
} from "../../redux/reducers/chatRoomList";
import { setProfile } from "../../redux/reducers/profile";
import { v4 as uuid } from "uuid";
import { Input } from "antd";
import socket from "../../services/socket";

const { TextArea } = Input;

interface IChatWindowProps {
  profile: IProfile; // current user's profile
  room: IChatRoom | undefined; // current active chatRoom. active room could be null
  messageList: IMessage[]; // all msg in current chat room
  // sendMessage: () => void;
}

const ChatWindow = ({ profile, room, messageList }: IChatWindowProps) => {
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const dummyMsgRef = React.useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!room) {
      return;
    }

    if (msg.trim() === "") {
      return;
    }

    let m: IMessage = {
      roomId: room?.roomId,
      messageId: uuid(),
      senderProfile: profile,
      sentAt: new Date().toLocaleTimeString(),
      content: msg,
      type: "TEXT",
    };
    socket.emit("newMessage", m);
    dispatch(addMessage(m));
    dispatch(updateLastMsg(m));
    setMsg("");
  };

  const onKeyUp = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key.toLowerCase() === "enter" && evt.shiftKey) {
    } else if (evt.key.toLowerCase() === "enter") {
      sendMessage();
    }
  };

  // make msgList window alaways scroll to the bottom, but only when msgList or room have changed.
  // add a dummy invisible div at the bottom, always scroll into this div.
  useEffect(() => {
    dummyMsgRef.current?.scrollIntoView();
  }, [room, messageList]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected ");
      socket.on("loginResponse", (res: any) => {
        console.log("login response: ", res);
        dispatch(setProfile(res.profile));
        dispatch(initializeProfileList(res.profileList));
        dispatch(initializeChatRooms(res.chatRoomList));
        dispatch(initializeMessageList(res.messages));
      });

      socket.on("newMessage", (m: any) => {
        // console.log("what happened, why so many new msg");
        dispatch(addMessage(m));
        dispatch(updateLastMsg(m));
        dispatch(updateUnreadCount(m));
      });
    });
  }, []);

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid #454451",
          height: "64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          color: "#FFFFFF",
        }}
      >
        <div style={{ color: "#FFFFFF" }}>{room?.name}</div>
        <div>members {room?.members.length}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "calc(100vh - 180px - 64px)",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "8px 6px",
          }}
        >
          {messageList.map((m) => (
            <Message key={m.messageId} msg={m} profile={profile} />
          ))}
          <div ref={dummyMsgRef} style={{ visibility: "hidden" }}>
            placeholder
          </div>
        </div>

        <div
          style={{
            height: "120px",
            width: "100%",
            borderTop: "1px solid gray",
            position: "fixed",
            bottom: "0",
          }}
        >
          <textarea
            value={msg}
            onChange={(evt) => setMsg(evt.target.value)}
            onKeyUp={onKeyUp}
            rows={4}
            style={{
              backgroundColor: "#26252c",
              border: "0",
              color: "#FFFFFF",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

interface IMessageProps {
  msg: IMessage;
  profile: IProfile;
}

const Message = ({ msg, profile }: IMessageProps) => {
  let sentByMe = msg.senderProfile.userId === profile.userId;
  let avatarDiv = (
    <div>
      <Avatar style={{ backgroundColor: "#f56a00" }} size="large">
        {msg.senderProfile.nickname[0]}
      </Avatar>
    </div>
  );
  let txtDiv = (
    <div style={sentByMe ? { marginRight: "16px" } : { marginLeft: "16px" }}>
      <div
        style={{
          color: "#C9C7D0",
          fontSize: "small",
          marginBottom: "8px",
          textAlign: sentByMe ? "right" : "unset",
        }}
      >
        <span style={{ marginRight: "12px", color: "#C9C7D0" }}>
          {msg.senderProfile.nickname}
        </span>
        <span style={{ color: "#7B798F" }}>{msg.sentAt}</span>
      </div>
      <div
        className={
          sentByMe ? "message-content-by-me" : "message-content-by-other"
        }
      >
        {msg.content}
      </div>
    </div>
  );

  return (
    <div className={sentByMe ? "sent-by-me" : "sent-by-others"}>
      <div className="content-wrapper">
        <div style={{ display: "flex" }}>
          {sentByMe ? (
            <React.Fragment>
              {txtDiv}
              {avatarDiv}{" "}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {avatarDiv} {txtDiv}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
