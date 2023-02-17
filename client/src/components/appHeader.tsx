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
          {" "}
          <Avatar style={{ backgroundColor: "#f56a00" }} size="large">
            {profile.nickname[0]}
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
