import React, { useState, useEffect } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { IMessageList, IChatRoom, IMessage, IProfile } from "../../types";
import { addMessage } from "../../redux/reducers/messageList";
import { updateLastMsg } from "../../redux/reducers/chatRoomList";
import { v4 as uuid } from "uuid";
import { Input } from "antd";
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
      // sentFrom: profile.userId,
      senderProfile: profile,
      sentAt: new Date().toLocaleTimeString(),
      content: msg,
      type: "TEXT",
    };
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

  // make msgList window alaways scroll to the bottom, but only when msgList, room got changed.
  useEffect(() => {
    dummyMsgRef.current?.scrollIntoView();
  }, [room, messageList]);

  return (
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
          height: "calc(100vh - 180px)",
          overflowY: "auto",
          overflowX: "hidden",
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
  );
};

export default ChatWindow;

interface IMessageProps {
  msg: IMessage;
  profile: IProfile;
}

const Message = ({ msg, profile }: IMessageProps) => {
  let sentByMe = msg.senderProfile.userId === profile.userId;
  return (
    <div className={sentByMe ? "sent-by-me" : "sent-by-others"}>
      <div className="content-wrapper">{msg.content}</div>
    </div>
  );
};
