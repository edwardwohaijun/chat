/*
import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducter'
import { devToolsEnhancer } from 'redux-devtools-extension'
const store = createStore(rootReducer, devToolsEnhancer({}));
export default store;
*/

import { configureStore } from "@reduxjs/toolkit";
// import nameReducer from "../reducers/nameReducer";
// import countReducer from "../reducers/countReducer";
import profileReducer from "../reducers/profile";
import messageList from "../reducers/messageList";
import chatRoomList from "../reducers/chatRoomList";
import profileList from "../reducers/profileList";

export const store = configureStore({
  reducer: {
    // counter: countReducer,
    // name: nameReducer,
    profile: profileReducer,
    profileList,
    chatRoomList,
    messageList,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
