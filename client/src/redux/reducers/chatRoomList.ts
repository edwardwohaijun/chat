import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IChatRoomList, IChatRoom, IMessage } from "../../types";
import { v4 as uuid } from "uuid";

// TODO: 如果要删除, 则下面的initialState也要更新, 那里用到了这里的第一个item的roomId.
let chatRooms: IChatRoom[] = [
  { name: "Announcements", roomId: uuid(), members: [] },
  { name: "Share your story", roomId: uuid(), members: [] },
  { name: "General", roomId: uuid(), members: [] },
  { name: "Announcements", roomId: uuid(), members: [] },
  { name: "Design product", roomId: uuid(), members: [] },
  { name: "Product team", roomId: uuid(), members: [] },
];

const initialState: IChatRoomList = {
  list: chatRooms,
  activeRoomId: chatRooms[0].roomId,
};

export const chatRoomListSlice = createSlice({
  name: "chatRoomList",
  initialState,
  reducers: {
    addChatRoom: (state, action: PayloadAction<IChatRoom>) => {
      state.list.unshift(action.payload);
    },
    removeChatRoom: (state, action: PayloadAction<IChatRoom>) => {
      let idx = state.list.findIndex((r) => r.roomId === action.payload.roomId);
      if (idx !== -1) {
        state.list.splice(idx, 1);
      }
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.activeRoomId = action.payload;
    },
    updateLastMsg: (state, action: PayloadAction<IMessage>) => {
      let roomIdx = state.list.findIndex(
        (r) => r.roomId === action.payload.roomId
      );
      if (roomIdx !== -1) {
        state.list[roomIdx].lastMsg = action.payload;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addChatRoom, removeChatRoom, setActive, updateLastMsg } =
  chatRoomListSlice.actions;

export default chatRoomListSlice.reducer;
