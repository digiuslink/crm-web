import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers } from "../../api/users";
// import Parse from "parse";

export interface IUserState {
  users?: Array<any>;
  resState?: "loading" | "loaded" | "error";
}

const initialState: IUserState = {
  users: undefined,
};

export const getUsersThunk = createAsyncThunk(
  "user/getUsers",
  async (_, { dispatch }) => {
    try {
      dispatch(setResState("loading"));
      const users = await getUsers();
      dispatch(setResState("loaded"));
      return users;
    } catch (_) {
      dispatch(setResState("error"));
    }
  }
);
export const userSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setResState: (state, { payload }) => {
      state.resState = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsersThunk.fulfilled, (state, { payload }) => {
      state.users = payload;
    });
  },
});
export const { setResState } = userSlice.actions;
export default userSlice.reducer;
