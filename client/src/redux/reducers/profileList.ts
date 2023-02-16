import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IProfileList } from "../../types";

const initialState: IProfileList = {
  list: [],
};

export const profileListSlice = createSlice({
  name: "profileList",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<IProfileList>) => {
      console.log("hello, ", action.payload);
      return action.payload;
    },
  },
});

export const { initialize } = profileListSlice.actions;
export default profileListSlice.reducer;
