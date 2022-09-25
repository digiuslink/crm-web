import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getClients, IClientFilter } from "../../api/client";
import { IClient } from "./IClient";
// import Parse from "parse";

export interface IClientState {
  error?: boolean;
  errorMsg?: string;
  loading?: boolean;
  clients?: IClient[];
}

const initialState: IClientState = {
  error: false,
  errorMsg: undefined,
  loading: false,
  clients: undefined,
};

export const getClientsThunk = createAsyncThunk(
  "clients/get",
  async ({ filter }: { filter?: IClientFilter }, { rejectWithValue }) => {
    try {
      return await getClients(filter);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClientsThunk.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getClientsThunk.fulfilled, (state, { payload }) => {
      state.clients = payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(getClientsThunk.rejected, (state, { payload }) => {
      state.error = true;
      state.errorMsg = payload as string;
      state.loading = false;
    });
  },
});
// export const { setClientAddedFalse } = clientSlice.actions;
export default clientsSlice.reducer;
