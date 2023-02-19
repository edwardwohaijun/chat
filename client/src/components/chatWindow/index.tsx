import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "antd";
import { BsPeople, BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAlternateEmail, MdSquareFoot } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { validateMention } from "../../utilis";

import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  messageIdUpdateType,
  IChatRoom,
  IMessage,
  IProfile,
  MentionedUser,
} from "../../types";
import {
  initializeMessageList,
  updateMessageId,
  addMessage,
} from "../../redux/reducers/messageList";
import { initializeProfileList } from "../../redux/reducers/profileList";
import {
  updateLastMsg,
  initializeChatRooms,
  updateUnreadCount,
} from "../../redux/reducers/chatRoomList";
import Message from "./message";
import MentionList from "./mentionList";
import MemberList from "./memberList";
import { setProfile } from "../../redux/reducers/profile";
import { v4 as uuid } from "uuid";
import Socket from "../../services/socket";
const socket = Socket.getInstance();

interface IChatWindowProps {
  profile: IProfile; // current user's profile
  room: IChatRoom | undefined; // current active chatRoom. active room could be null
  messageList: IMessage[]; // all msg in current chat room
}

const ChatWindow = ({ profile, room, messageList }: IChatWindowProps) => {
  const [msg, setMsg] = useState("");
  let [membersPopupVisible, setMembersPopupVisible] = useState(false);
  let [emojiVisible, setEmojiVisible] = useState(false);
  let [mentionListVisible, setMentionListVisible] = useState(false);
  const [mentioned, setMentioned] = useState<MentionedUser | null>(null); // key: userId, value: nickname. after sending the msg, reset this obj.
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // const curserPos = useRef(msg.length);
  const [quote, setQuote] = useState<IMessage | null>(null);

  const profileList = useSelector((state: RootState) => state.profileList);

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
    if (quote != null) m.quote = quote;

    m.mentions = validateMention(m.content, mentioned);
    socket.emit("newMessage", m);
    dispatch(addMessage(m));
    dispatch(updateLastMsg(m));
    setMsg("");
    setQuote(null);
    setMentioned(null);
  };

  const onMentionSelect = (evt: any) => {
    setMentionListVisible(false);
    inputRef.current?.focus();
    let currentPos = inputRef.current!.selectionStart;

    // onclick is defined on the parent div, but click might occur on 2 children div
    // we need to go up and search for parent class, and get the data attribute.
    let tgt = evt.target.closest(".mention-item");
    let mentionedId = Number(tgt.dataset.mentionId);
    let user = profileList.list.find((p) => p.userId === mentionedId);
    let newMsg =
      msg.substring(0, currentPos) +
      `@${user?.nickname} ` +
      msg.substring(currentPos);

    setMsg(newMsg);
    setMentioned({
      ...mentioned,
      [mentionedId]: user?.nickname,
    } as MentionedUser);

    setTimeout(() => {
      inputRef.current!.selectionStart = currentPos + user!.nickname.length + 2; // '@' character and the following space after "@****"
      inputRef.current!.selectionEnd = currentPos + user!.nickname.length + 2;
    }, 0);
  };

  const onEmojiSelect = (emojiData: EmojiClickData, event: MouseEvent) => {
    toggleEmoji();
    inputRef.current?.focus();
    let currentPos = inputRef.current!.selectionStart;

    let newMsg =
      msg.substring(0, currentPos) +
      emojiData.emoji +
      msg.substring(currentPos);
    setMsg(newMsg);

    // without timeout, after emoji insert, cursor always stay at the end.
    setTimeout(() => {
      inputRef.current!.selectionStart = currentPos + 1;
      inputRef.current!.selectionEnd = currentPos + 1;
    }, 0);
  };

  // const onKeyUp = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
  const onKeyUp = (evt: any) => {
    // people might not be typing text, but pressing arrow key to move cursor position.
    // curserPos.current = inputRef.current!.selectionStart;
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
    inputRef.current?.focus();
  }, [quote]);

  useEffect(() => {
    const hideEmoji = (evt: MouseEvent) => {
      let tgt = evt.target as HTMLElement;
      if (tgt.closest(".emoji-button-wrapper") != null) {
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
        dispatch(addMessage(m));
        dispatch(updateLastMsg(m));
        dispatch(updateUnreadCount(m));
      });

      socket.on("newMessageId", (id: messageIdUpdateType) => {
        dispatch(updateMessageId(id));
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
            <Message
              key={m.messageId}
              msg={m}
              profile={profile}
              setQuote={setQuote}
            />
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
                onClick={toggleEmoji}
              />
            </div>
            <div className="mention-button-wrapper">
              <MdOutlineAlternateEmail
                style={{ color: "#FFFFFF", cursor: "pointer" }}
                size="1.5em"
                onClick={toggleMention}
              />
            </div>
          </div>
          <div className={`emoji-wrapper ${emojiVisible ? "" : "invisible"}`}>
            <EmojiPicker
              height={450}
              width={320}
              onEmojiClick={onEmojiSelect}
            />
          </div>
          <div
            className={`mention-list-wrapper ${
              mentionListVisible ? "" : "invisible"
            }`}
          >
            {room && (
              <MentionList
                members={room.members}
                close={() => setMentionListVisible(false)}
                onMentionSelect={onMentionSelect}
              />
            )}
          </div>

          <textarea
            id="chat-input-box"
            value={msg}
            onChange={(evt) => setMsg(evt.target.value)}
            onKeyUp={onKeyUp}
            rows={6}
            ref={inputRef}
          />
          {quote && (
            <div className="quoted-content-wrapper">
              <div className="quoted-content">
                <div>{`${quote.senderProfile.nickname}: ${quote.content}`}</div>
              </div>
              <div className="delete-quote-icon">
                <RxCross2
                  style={{ color: "#FFFFFF", cursor: "pointer" }}
                  size="1em"
                  onClick={() => setQuote(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
