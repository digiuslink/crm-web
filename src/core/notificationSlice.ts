import { getNotifs, INotification } from "../api/notifications";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Query } from "parse";

export const getNotificationsThunk = createAsyncThunk(
  "notification/get",
  async () => {
    try {
      return await getNotifs();
    } catch (err) {}
  }
);

export const liveQuerySubscribeThunk = createAsyncThunk(
  "notification/subscribe",
  async () => {
    try {
      const query = new Query("Notification");
      const subscription = await query.subscribe();
      return subscription;
    } catch (err) {}
  }
);

interface InitialStateType {
  notifications?: INotification[];
  newNotifiaction: boolean;
  subscribe?: Parse.LiveQuerySubscription;
  count?: number;
}

const initialState: InitialStateType = {
  notifications: [],
  newNotifiaction: false,
  subscribe: undefined,
  count: 0,
};

export const notiSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(liveQuerySubscribeThunk.fulfilled, (state, { payload }) => {
      state.subscribe = payload;
    });
    builder.addCase(getNotificationsThunk.fulfilled, (state, { payload }) => {
      state.notifications = payload;
    });
  },
});

// export const { newNotification } = notiSlice.actions;
export default notiSlice.reducer;
