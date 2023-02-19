import React, { useEffect } from "react";
import { Avatar } from "antd";
import "./index.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import "./mentionList.scss";

const MentionList = ({
  members,
  close,
  onMentionSelect,
}: {
  members: number[];
  close: () => void;
  onMentionSelect: (evt: any) => void;
}) => {
  const profileList = useSelector((state: RootState) => state.profileList);
  const hideMentionList = (evt: MouseEvent) => {
    let tgt = evt.target as HTMLElement;
    // mention icon was clicked, ignore it, otherwise, the outside cilck handler will be triggered.
    if (tgt.closest(".mention-button-wrapper") != null) {
      return;
    }
    // outside mention list wrapper was clicked
    if (tgt.closest(".mention-list-wrapper") == null) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideMentionList);
    return () => document.removeEventListener("click", hideMentionList);
  }, []);

  return (
    <div className={`mention-list`}>
      {members.map((m) => {
        let user = profileList.list.find((p) => p.userId === m);
        return (
          <div
            className="mention-item"
            key={m}
            data-mention-id={user?.userId}
            onClick={onMentionSelect}
          >
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

export default MentionList;
