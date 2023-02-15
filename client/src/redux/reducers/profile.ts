import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../../types";

/*
export interface Profile {
  userId: string;
  nickname: string;
  avatar: string;
}
*/

const initialState: IProfile = {
  userId: "111",
  nickname: "222",
  avatar: "333",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IProfile>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
