import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IMessageList, IMessage } from "../../types";

const initialState: IMessageList = {
  list: [],
};

export const messageListSlice = createSlice({
  name: "messageList",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.list.push(action.payload);
    },
    removeMessage: (state, action: PayloadAction<IMessage>) => {
      let msgIdx = state.list.findIndex(
        (m) => m.messageId === action.payload.messageId
      );
      if (msgIdx !== -1) {
        state.list.splice(msgIdx, 1);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMessage, removeMessage } = messageListSlice.actions;

export default messageListSlice.reducer;
