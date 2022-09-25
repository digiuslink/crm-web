import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConfigs } from "../api/configs";

interface InitialState {
  products?: Array<"string">;
  productsResponseState?: "loading" | "loaded" | "error" | "none";
  clientConfigs?: any;
  resState: "loading" | "none" | "loaded" | "error";
}

const initialState: InitialState = {
  resState: "none",
  productsResponseState: "none",
};

export const getClientConfigsThunk = createAsyncThunk(
  "configs/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setResState("loading"));
      const configs = await getConfigs("client");
      dispatch(setResState("loaded"));
      return configs;
    } catch (err) {
      dispatch(setResState("error"));
    }
  }
);

export const getProductsThunk = createAsyncThunk(
  "app/products/get",
  async (_, { dispatch }) => {
    try {
      dispatch(setProductsResponseState("loading"));
      const res = await fetch("http://192.168.3.249:3001/api/v1/product");
      const result = await res.json();
      const prs = result?.products
        .filter(
          (product: any) => product.category === "614336be732206062ec6dbe3"
        )
        .map((pr: any) => pr.productName);
      dispatch(setProductsResponseState("loaded"));
      dispatch(setProductsResponseState("none"));
      return prs;
    } catch (err) {
      dispatch(setProductsResponseState("error"));
      dispatch(setProductsResponseState("none"));
    }
  }
);

export const configSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    setResState: (state, { payload }) => {
      state.resState = payload;
    },

    setProductsResponseState: (state, { payload }) => {
      state.productsResponseState = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClientConfigsThunk.fulfilled, (state, { payload }) => {
      state.clientConfigs = payload;
    });
    builder.addCase(getProductsThunk.fulfilled, (state, { payload }) => {
      state.products = payload;
    });
  },
});

export const { setResState, setProductsResponseState } = configSlice.actions;
export default configSlice.reducer;
