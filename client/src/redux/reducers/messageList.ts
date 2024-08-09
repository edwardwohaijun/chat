import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IMessageList, IMessage, messageIdUpdateType } from "../../types";

const initialState: IMessageList = {
  list: [],
};

export const messageListSlice = createSlice({
  name: "messageList",
  initialState,
  reducers: {
    initializeMessageList: (state, action: PayloadAction<[IMessage]>) => {
      state.list = action.payload;
    },
    updateMessageId: (state, action: PayloadAction<messageIdUpdateType>) => {
      // TODO: use findLastIndex.
      let idx = state.list.findIndex((m) => m.messageId === action.payload.old);
      if (idx !== -1) {
        // immer lib
        state.list[idx]._id = action.payload.new;
        // let newState = *****;   Object.assign({}, ...object, action.payload)
        //
        // return newState
      }
    },
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
export const {
  initializeMessageList,
  updateMessageId,
  addMessage,
  removeMessage,
} = messageListSlice.actions;

export default messageListSlice.reducer;
