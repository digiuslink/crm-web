import { IClient } from "./IClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addClient,
  editClient,
  getClient,
  setClientVerified,
} from "../../api/client";
// import Parse from "parse";

export interface IClientState {
  error?: boolean;
  errorMsg?: string;
  addLoading?: boolean;
  clientAdded?: boolean;
  clientEdited?: "changed" | "error" | "none" | "loading";
  isVerified?: boolean;
  isVerifiedChanged?: "changed" | "error" | "none" | "loading";
  client?: IClient;
  getClientResponseState?: "loaded" | "error" | "none" | "loading";
  getClientError?: boolean;
}

const initialState: IClientState = {
  error: false,
  errorMsg: undefined,
  addLoading: false,
  clientAdded: false,
  clientEdited: "none",
  isVerified: false,
  isVerifiedChanged: "none",
  client: undefined,
  getClientResponseState: "none",
  getClientError: false,
};

export const addClientThunk = createAsyncThunk(
  "client/add",
  async (client: IClient, { rejectWithValue }) => {
    try {
      await addClient(client);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getClientThunk = createAsyncThunk(
  "client/get",
  async (clientId: string, { dispatch }) => {
    try {
      dispatch(setClientEditedChenged("loading"));
      const client = await getClient(clientId);
      dispatch(setIsVerified(client?.isVerified));
      dispatch(setClientEditedChenged("none"));
      return client;
    } catch (err) {
      dispatch(setGetClientError(true));
      dispatch(setClientEditedChenged("error"));
      dispatch(setClientEditedChenged("none"));
    }
  }
);

export const editClientThunk = createAsyncThunk(
  "client/edit",
  async (client: IClient, { dispatch }) => {
    try {
      dispatch(setClientEditedChenged("loading"));
      await editClient(client);
      dispatch(getClientThunk(client.objectId));
      dispatch(setClientEditedChenged("changed"));
      dispatch(setClientEditedChenged("none"));
    } catch (err) {
      dispatch(setClientEditedChenged("error"));
      dispatch(setClientEditedChenged("none"));
    }
  }
);

export const setVerifiedThunk = createAsyncThunk(
  "client/setVerified",
  async (
    { objectId, isVerified }: { objectId: string; isVerified: boolean },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(isVerifiedChanged("loading"));
      const result = await setClientVerified(objectId, isVerified);
      dispatch(setIsVerified(result));
      dispatch(isVerifiedChanged("changed"));
      dispatch(isVerifiedChanged("none"));
    } catch (err) {
      dispatch(isVerifiedChanged("error"));
      dispatch(isVerifiedChanged("none"));
      rejectWithValue(err.message);
    }
  }
);
export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientAddedFalse: (state) => {
      state.clientAdded = false;
    },
    setClientEditedChenged: (state, { payload }) => {
      state.clientEdited = payload;
    },
    setIsVerified: (state, { payload }) => {
      state.isVerified = payload;
    },
    isVerifiedChanged: (state, { payload }) => {
      state.isVerifiedChanged = payload;
    },
    setGetClientError: (state, { payload }) => {
      state.getClientError = payload;
    },
  },
  extraReducers: (builder) => {
    // Add Client
    builder.addCase(addClientThunk.pending, (state) => {
      state.error = false;
      state.errorMsg = undefined;
      state.addLoading = true;
      state.clientAdded = false;
    });
    builder.addCase(addClientThunk.fulfilled, (state) => {
      state.error = false;
      state.errorMsg = undefined;
      state.addLoading = false;
      state.clientAdded = true;
    });
    builder.addCase(addClientThunk.rejected, (state, { payload }) => {
      state.error = true;
      state.errorMsg = payload as string;
      state.addLoading = false;
      state.clientAdded = false;
    });
    builder.addCase(getClientThunk.fulfilled, (state, { payload }) => {
      state.client = payload;
    });
  },
});
export const {
  setClientAddedFalse,
  setIsVerified,
  isVerifiedChanged,
  setClientEditedChenged,
  setGetClientError,
} = clientSlice.actions;
export default clientSlice.reducer;
