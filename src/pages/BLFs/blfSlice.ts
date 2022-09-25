import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addBlf, editBlf, getBlf, getBlfs, IBlfFilter } from "../../api/blf";

export interface IBlfItem {
  designation: string;
  qte: number;
  price: number;
  remise?: number;
  amount: number;
}

export interface IBlf {
  objectId?: string;
  client: any;
  blfDate: { __type: string; iso: Date };
  total?: number;
  remise?: number;
  blfItems: IBlfItem[];
  note?: string;
  addedBy?: any;
  assignedTo?: any;
  gps?: { latitude: number; longitude: number };
}

interface BlfState {
  addBlfLoading?: "loading" | "loaded" | "error" | "none";
  addedBlf?: IBlf;
  getBlfsLoading?: "loading" | "loaded" | "error" | "none";
  blfs?: IBlf[];
  updateBlfLoading?: "loading" | "loaded" | "error" | "none";
  blf?: IBlf;
  getBlfLoading?: "loading" | "loaded" | "error" | "none";
  count?: number;
}

const initialState: BlfState = {
  addBlfLoading: "none",
  addedBlf: undefined,
  getBlfsLoading: "none",
  blfs: undefined,
  count: 0,
};

// Thunks

export const addBlfThunk = createAsyncThunk(
  "blf/add",
  async ({ blf }: { blf: IBlf }, { dispatch }) => {
    try {
      dispatch(setAddBlfLoading("loading"));
      await addBlf(blf);
      dispatch(getBlfsThunk({}));
      dispatch(setAddBlfLoading("loaded"));
      dispatch(setAddBlfLoading("none"));
    } catch (err) {
      dispatch(setAddBlfLoading("error"));
      dispatch(setAddBlfLoading("none"));
    }
  }
);

export const getBlfsThunk = createAsyncThunk(
  "blfs/get",
  async (
    { filter }: { filter?: IBlfFilter },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setGetBlfsLoading("loading"));
      const blfs = await getBlfs(filter, dispatch);
      dispatch(setGetBlfsLoading("loaded"));
      dispatch(setGetBlfsLoading("none"));

      return blfs;
    } catch (err: any) {
      dispatch(setGetBlfsLoading("error"));
      dispatch(setGetBlfsLoading("none"));
      return rejectWithValue(err.message);
    }
  }
);

export const getBlfThunk = createAsyncThunk(
  "blf/get",
  async (blfObjectId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setGetBlfLoading("loading"));
      const blf = await getBlf(blfObjectId);
      dispatch(setGetBlfLoading("loaded"));
      dispatch(setGetBlfLoading("none"));

      return blf;
    } catch (err: any) {
      dispatch(setGetBlfLoading("error"));
      dispatch(setGetBlfLoading("none"));
    }
  }
);

export const updateBlfThunk = createAsyncThunk(
  "blfs/upadte",
  async (blf: IBlf, { dispatch }) => {
    try {
      dispatch(setEditBlfsLoading("loading"));
      await editBlf(blf);
      dispatch(getBlfsThunk({}));
      dispatch(setEditBlfsLoading("loaded"));
      dispatch(setEditBlfsLoading("none"));
    } catch (err: any) {
      dispatch(setEditBlfsLoading("error"));
      dispatch(setEditBlfsLoading("none"));
    }
  }
);

export const blfSlice = createSlice({
  name: "blf",
  initialState,
  reducers: {
    setAddBlfLoading: (state, { payload }) => {
      state.addBlfLoading = payload;
    },
    setGetBlfsLoading: (state, { payload }) => {
      state.getBlfsLoading = payload;
    },
    setEditBlfsLoading: (state, { payload }) => {
      state.updateBlfLoading = payload;
    },
    setGetBlfLoading: (state, { payload }) => {
      state.updateBlfLoading = payload;
    },
    setBlfCount: (state, { payload }) => {
      state.count = payload;
    },
  },
  extraReducers: (builder) => {
    // BLf(s)
    builder.addCase(getBlfsThunk.fulfilled, (state, { payload }) => {
      state.blfs = payload as any;
    });

    // Blf
    builder.addCase(getBlfThunk.fulfilled, (state, { payload }) => {
      state.blf = payload as any;
    });
  },
});

export const {
  setAddBlfLoading,
  setGetBlfsLoading,
  setEditBlfsLoading,
  setGetBlfLoading,
  setBlfCount,
} = blfSlice.actions;
export default blfSlice.reducer;
