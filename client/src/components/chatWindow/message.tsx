import React, { useState } from "react";
import { Avatar } from "antd";
import { FaQuoteLeft } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./message.scss";
import { IMessage, IProfile } from "../../types";

interface IMessageProps {
  msg: IMessage;
  profile: IProfile;
  setQuote: (msg: IMessage) => void;
}

const Message = ({ msg, profile, setQuote }: IMessageProps) => {
  const [quoteVisible, setQuoteVisible] = useState(false);
  let sentByMe = msg.senderProfile.userId === profile.userId;
  // the floating div showing 'quote', 'delete(not implemented)' button
  let quoteTool = (
    <div
      className={`quote-wrapper ${sentByMe ? "by-me" : "by-others"} ${
        quoteVisible ? "" : "invisible"
      }`}
    >
      <div onClick={() => setQuote(msg)}>
        <FaQuoteLeft
          size="0.8em"
          style={{ color: "#C9C7D0", cursor: "pointer" }}
        />{" "}
      </div>
      <div>
        <RiDeleteBin5Line
          size="0.8em"
          style={{ color: "#C9C7D0", cursor: "pointer" }}
        />{" "}
      </div>
    </div>
  );

  let avatarDiv = (
    <div>
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
      {msg.quote && (
        <div
          className={`quoted-content--below-msg-wrapper ${
            sentByMe ? "by-me" : "by-others"
          }`}
        >
          <div className="quoted-content-below-msg">
            <div>{`${msg.quote.senderProfile.nickname}: ${msg.quote.content}`}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <React.Fragment>
      <div
        className={sentByMe ? "sent-by-me" : "sent-by-others"}
        style={{ position: "relative" }}
        onMouseEnter={() => setQuoteVisible(true)}
        onMouseLeave={() => setQuoteVisible(false)}
      >
        {sentByMe ? quoteTool : null}
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
        {sentByMe ? null : quoteTool}
      </div>
      {msg.quote && <div style={{ height: "32px" }}></div>}
    </React.Fragment>
  );
};

export default Message;
