import React from "react";
import "./sidebar.scss";
import { Avatar, Badge } from "antd";
import forumLogo from "../assets/img/forum.svg";
import chatIcon from "../assets/img/chat.svg";
import matches from "../assets/img/matches.svg";
import members from "../assets/img/members.svg";
import contributors from "../assets/img/contributors.svg";

const engageItems = [
  { icon: forumLogo, desc: "Forum" },
  { icon: chatIcon, desc: "Chat", active: true },
  { icon: matches, desc: "Matches" },
];
const peopleItems = [
  { icon: members, desc: "Members" },
  { icon: contributors, desc: "Contributors" },
];

const Engage = () => (
  <div>
    <div className="section-header">Engage</div>
    {engageItems.map((e, idx) => (
      <div key={idx} className="app-entry">
        <div className="app-entry-wrapper">
          <div className="app-entry-icon">
            {e.active ? (
              <Badge count={25}>
                <Avatar size="large" src={e.icon} />
              </Badge>
            ) : (
              <img src={e.icon} />
            )}
          </div>
          <div className={`app-entry-description ${e.active ? "active" : ""}`}>
            {e.desc}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const People = () => (
  <div>
    <div className="section-header">Engage</div>
    {peopleItems.map((e, idx) => (
      <div key={idx} className="app-entry">
        <div className="app-entry-wrapper">
          <div className="app-entry-icon">
            <img src={e.icon} />{" "}
          </div>
          <div className="app-entry-description">{e.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Engage />
      <People />
    </div>
  );
};

export default Sidebar;
