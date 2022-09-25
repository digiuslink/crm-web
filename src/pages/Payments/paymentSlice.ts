import { IPaymentsFilter } from "./../../api/payments";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPayments, IPayment } from "../../api/payments";

interface InitialState {
  getPaymentsLoading: "loading" | "loaded" | "error" | "none";
  payments: IPayment[];
  count?: number;
}
const initialState: InitialState = {
  getPaymentsLoading: "none",
  payments: [],
  count: 0,
};

// Thunks
export const getPaymentsThunk = createAsyncThunk(
  "payments/get",
  async ({ filter }: { filter?: IPaymentsFilter }, { dispatch }) => {
    try {
      dispatch(setGetPaymentsLoading("loading"));
      const _payments = await getPayments(filter, dispatch);
      dispatch(setGetPaymentsLoading("loaded"));
      dispatch(setGetPaymentsLoading("none"));
      return _payments;
    } catch (err) {
      dispatch(setGetPaymentsLoading("error"));
      dispatch(setGetPaymentsLoading("none"));
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setGetPaymentsLoading: (state, { payload }) => {
      state.getPaymentsLoading = payload;
    },
    setPaymentsCount: (state, { payload }) => {
      state.count = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentsThunk.fulfilled, (state, { payload }) => {
      state.payments = payload as any;
    });
  },
});

export default paymentSlice.reducer;
export const { setGetPaymentsLoading, setPaymentsCount } = paymentSlice.actions;
