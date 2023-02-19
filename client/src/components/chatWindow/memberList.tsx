import React, { useEffect } from "react";
import { Avatar } from "antd";
import "./index.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import "./memberList.scss";

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
    let tgt = evt.target as HTMLElement;
    if (
      // this is the toggle button for pop-up, we let button handle the visibility
      tgt.closest(".group-member-icon-wrapper") != null
    ) {
      return;
    }
    // if mouse click happens outside the pop-up, close it.
    if (tgt.closest(".room-member-list") == null) {
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

export default MemberList;
