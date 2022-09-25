import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addPack, getPacks, IPack } from "../../api/pack";

interface IPackState {
  packs?: IPack[];
  getPacksLoading?: "loading" | "loaded" | "error" | "none";
  addPackLoading?: "loading" | "loaded" | "error" | "none";
}
const initialState: IPackState = {
  packs: undefined,
  addPackLoading: "none",
};

// Thunks
export const addPackThunk = createAsyncThunk(
  "pack/add",
  async (pack: IPack, { dispatch }) => {
    try {
      dispatch(setAddPackLoading("loading"));
      await addPack(pack);
      dispatch(getPacksThunk());
      dispatch(setAddPackLoading("loadded"));
      dispatch(setAddPackLoading("none"));
    } catch (err) {
      dispatch(setAddPackLoading("error"));
      dispatch(setAddPackLoading("none"));
    }
  }
);

export const getPacksThunk = createAsyncThunk(
  "packs/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setGetPacksLoading("loading"));
      const _packs = await getPacks();
      dispatch(setGetPacksLoading("loadded"));
      dispatch(setGetPacksLoading("none"));
      return _packs;
    } catch (err) {
      dispatch(setGetPacksLoading("error"));
      dispatch(setGetPacksLoading("none"));
    }
  }
);

export const packSlice = createSlice({
  name: "blf",
  initialState,
  reducers: {
    setAddPackLoading: (state, { payload }) => {
      state.addPackLoading = payload;
    },
    setGetPacksLoading: (state, { payload }) => {
      state.getPacksLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPacksThunk.fulfilled, (state, { payload }) => {
      state.packs = payload as IPack[];
    });
  },
});

export const { setAddPackLoading, setGetPacksLoading } = packSlice.actions;
export default packSlice.reducer;
