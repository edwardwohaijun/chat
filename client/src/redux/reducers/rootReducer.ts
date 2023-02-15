import { combineReducers } from "redux";
// import countReducer from "./countReducer";
// import nameReducer from "./nameReducer";
import profileReudcer from "./profile";
import messageList from "./messageList";
import chatRoomList from "./chatRoomList";

const rootReducer = combineReducers({
  // count: countReducer,
  // name: nameReducer,
  profile: profileReudcer,
  chatRoomList,
  messageList,
});
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
