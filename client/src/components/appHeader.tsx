import React, { Dispatch, useEffect } from "react";
import { Avatar } from "antd";

// import { AppState } from "./redux/reducers/rootReducer";
// import { CountActions } from "./redux/actions/countActions";
// import { NameActions } from "./redux/actions/nameActions";
// import "./App.scss";

import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";

function AppHeader() {
  const profile = useSelector((state: RootState) => state.profile);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>logo</div>
      <div>
        <div>
          <Avatar src={`/chat/images/avatar/${profile.userId}.jpg`} />{" "}
          <span style={{ marginLeft: "8px", color: "#FFFFFF" }}>
            {profile.nickname}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
