import { createSlice, isAsyncThunkAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IProfileList, IProfile } from "../../types";

const initialState: IProfileList = {
  list: [],
};

export const profileListSlice = createSlice({
  name: "profileList",
  initialState,
  reducers: {
    initializeProfileList: (state, action: PayloadAction<[IProfile]>) => {
      state.list = action.payload;
    },
  },
});

export const { initializeProfileList } = profileListSlice.actions;
export default profileListSlice.reducer;
