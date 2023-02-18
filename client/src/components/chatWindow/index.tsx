import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "antd";
import { BsPeople, BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

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
import Socket from "../../services/socket";
const socket = Socket.getInstance();

interface IChatWindowProps {
  profile: IProfile; // current user's profile
  room: IChatRoom | undefined; // current active chatRoom. active room could be null
  messageList: IMessage[]; // all msg in current chat room
  // sendMessage: () => void;
}

const ChatWindow = ({ profile, room, messageList }: IChatWindowProps) => {
  const [msg, setMsg] = useState("");
  let [membersPopupVisible, setMembersPopupVisible] = useState(false);
  let [emojiVisible, setEmojiVisible] = useState(false);
  let [mentionListVisible, setMentionListVisible] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const curserPos = useRef(msg.length);

  const dispatch = useDispatch();
  const dummyMsgRef = React.useRef<HTMLDivElement>(null);

  const togglePopup = () => setMembersPopupVisible(!membersPopupVisible);
  const toggleEmoji = () => setEmojiVisible(!emojiVisible);
  const toggleMention = () => setMentionListVisible(!mentionListVisible);

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

  // const onKeyUp = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
  const onKeyUp = (evt: any) => {
    // console.log("start: ", evt.target.selectionStart);
    // people might not be typing text, but pressing arrow key to move cursor position.
    curserPos.current = inputRef.current!.selectionStart;
    if (evt.key.toLowerCase() === "enter" && evt.shiftKey) {
    } else if (evt.key.toLowerCase() === "enter") {
      sendMessage();
    }
  };

  /*
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    // inputRef.current.setSelectionRange(curserPos.current, curserPos.current);
  }, [msg]);
  */

  // make msgList window alaways scroll to the bottom, but only when msgList or room have changed.
  // add a dummy invisible div at the bottom, always scroll into this div.
  useEffect(() => {
    dummyMsgRef.current?.scrollIntoView();
  }, [room, messageList]);

  useEffect(() => {
    const hideEmoji = (evt: MouseEvent) => {
      let tgt = evt.target as HTMLElement;
      if (tgt.closest(".emoji-button-wrapper") != null) {
        toggleEmoji();
        return;
      }
      if (tgt.closest(".emoji-wrapper") == null) {
        setEmojiVisible(false);
      }
    };

    document.addEventListener("click", hideEmoji);
    return () => document.removeEventListener("click", hideEmoji);
  }, []);

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
        console.log("what happened, why so many new msg");
        dispatch(addMessage(m));
        dispatch(updateLastMsg(m));
        dispatch(updateUnreadCount(m));
      });

      socket.on("disconnect", (reason: string) => {
        if (reason === "io server disconnect") {
          console.log("disconnected by server)");
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
        }
        // else the socket will automatically try to reconnect
      });
    });
  }, []);

  return (
    <div>
      <div className="header-wrapper">
        <div style={{ color: "#FFFFFF", fontSize: "larger" }}>{room?.name}</div>
        <div className="group-member-icon-wrapper" onClick={togglePopup}>
          <BsPeople size="1.5em" />{" "}
          <span style={{ marginLeft: "8px", fontSize: "small" }}>
            {room?.members.length}
          </span>
        </div>

        {room && (
          <MemberList
            members={room.members}
            isVisible={membersPopupVisible}
            toggleVisibility={setMembersPopupVisible}
          />
        )}
      </div>

      <div className="chat-window-wrapper">
        <div className="message-list-wrapper">
          {messageList.map((m) => (
            <Message key={m.messageId} msg={m} profile={profile} />
          ))}
          <div ref={dummyMsgRef} style={{ visibility: "hidden" }}>
            placeholder
          </div>
        </div>

        <div className="chat-input-wrapper ">
          <div className="chat-toolbar">
            <div className="emoji-button-wrapper">
              <BsEmojiSmile
                style={{ color: "#FFFFFF", cursor: "pointer" }}
                size="1.5em"
              />
            </div>
            <div className="mention-button-wrapper">
              <MdOutlineAlternateEmail
                style={{ color: "#FFFFFF", cursor: "pointer" }}
                size="1.5em"
              />
            </div>
          </div>
          <div className={`emoji-wrapper ${emojiVisible ? "" : "invisible"}`}>
            <EmojiPicker
              height={450}
              width={320}
              onEmojiClick={(emojiData: EmojiClickData, event: MouseEvent) => {
                console.log("emojiData: ", emojiData);
                let newMsg =
                  msg.substring(0, curserPos.current) +
                  emojiData.emoji +
                  msg.substring(curserPos.current);
                setMsg(newMsg);
                toggleEmoji();
                inputRef.current?.focus();
              }}
            />
          </div>
          <div className={`memtion-list-wrapper `}>
            {room && (
              <MentionList
                members={room.members}
                isVisible={mentionListVisible}
              />
            )}
          </div>

          {/* const  = ({
  members,
  isVisible,
  toggleVisibility,
  */}

          <textarea
            id="chat-input-box"
            value={msg}
            onChange={(evt) => setMsg(evt.target.value)}
            onKeyUp={onKeyUp}
            rows={6}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

const MemberList = ({
  members,
  isVisible,
  toggleVisibility,
}: {
  members: number[];
  isVisible: boolean;
  toggleVisibility: (v: boolean) => void;
}) => {
  const profileList = useSelector((state: RootState) => state.profileList);

  const hidePopup = (evt: MouseEvent) => {
    // accessing membersPopupVisible always return false, no idea why
    if (
      // this is the toggle button for pop-up, we let button handle the visibility
      (evt.target as HTMLElement).closest(".group-member-icon-wrapper") != null
    ) {
      return;
    }
    // if mouse click happens outside the pop-up, close it.
    if ((evt.target as HTMLElement).closest(".room-member-list") == null) {
      toggleVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hidePopup);
    return () => document.removeEventListener("click", hidePopup);
  }, []);

  return (
    <div className={`room-member-list ${isVisible ? "" : "invisible"}`}>
      {members.map((m) => {
        let user = profileList.list.find((p) => p.userId === m);

        return (
          <div
            key={m}
            style={{ display: "flex", alignItems: "center", height: "48px" }}
          >
            <div style={{ width: "30%" }}>
              <Avatar src={`/chat/images/avatar/${user?.userId}.jpg`} />
            </div>

            <span style={{ width: "70%", color: "white", textAlign: "left" }}>
              {user?.nickname}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// <MentionList members={room?.members} isVisible={mentionListVisible} toggleVisibility={mentionListVisible} />
const MentionList = ({
  members,
  isVisible,
}: // toggleVisibility,
{
  members: number[];
  isVisible: boolean;
  // toggleVisibility: (v: boolean) => void;
}) => {
  const profileList = useSelector((state: RootState) => state.profileList);

  /*
  const hideMentionList = (evt: MouseEvent) => {
    if (
      (evt.target as HTMLElement).closest(".emoji-button-wrapper") != null
    ) {
      toggleEmoji();
      return;
    }
    if ((evt.target as HTMLElement).closest(".emoji-wrapper") == null) {
      setEmojiVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideMentionList);
    return () => document.removeEventListener("click", hideMentionList);
  }, []);
  */

  return (
    <div className={`mention-list ${isVisible ? "" : "invisible"}`}>
      {members.map((m) => {
        let user = profileList.list.find((p) => p.userId === m);

        return (
          <div className="mention-item" key={m}>
            <div style={{ width: "30%" }}>
              <Avatar src={`/chat/images/avatar/${user?.userId}.jpg`} />
            </div>
            <span style={{ width: "70%", textAlign: "left" }}>
              {user?.nickname}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface IMessageProps {
  msg: IMessage;
  profile: IProfile;
}

const Message = ({ msg, profile }: IMessageProps) => {
  let sentByMe = msg.senderProfile.userId === profile.userId;
  let avatarDiv = (
    <div>
      {/*<Avatar style={{ backgroundColor: "#f56a00" }} size="large">
        {msg.senderProfile.nickname[0]}
  </Avatar>*/}
      <Avatar src={`/chat/images/avatar/${msg.senderProfile.userId}.jpg`} />
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
        className={`message-content '
          ${sentByMe ? "by-me" : "by-other"}`}
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
