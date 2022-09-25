import { IGetRoutesFilter } from "./../api/routes";
import { IClientFilter } from "./../api/client";
import { createSlice } from "@reduxjs/toolkit";
import { IBlfFilter } from "../api/blf";

interface InitialState {
  clientFiltersCount?: number;
  clientFilter?: IClientFilter;
  blfFiltersCount?: number;
  blfFilter?: IBlfFilter;
  routesFilter?: IGetRoutesFilter;
  routesFilterCount?: number;
}

const initialState: InitialState = {
  clientFiltersCount: 0,
  clientFilter: {},
  blfFiltersCount: 0,
  blfFilter: {},
  routesFilter: {
    startDate: new Date(),
    endDate: new Date(),
  },
  routesFilterCount: 0,
};

export const appSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    setClientFiltersCount: (state, { payload }) => {
      state.clientFiltersCount = payload;
    },
    setClientFilters: (state, { payload }) => {
      state.clientFilter = payload;
    },
    setBlfFiltersCount: (state, { payload }) => {
      state.blfFiltersCount = payload;
    },
    setBlfFilters: (state, { payload }) => {
      state.blfFilter = payload;
    },
    setRouteFilters: (state, { payload }) => {
      state.routesFilter = payload;
    },
    setRouteFiltersCount: (state, { payload }) => {
      state.routesFilterCount = payload;
    },
  },
});

export const {
  setClientFilters,
  setClientFiltersCount,
  setBlfFilters,
  setBlfFiltersCount,
  setRouteFilters,
  setRouteFiltersCount,
} = appSlice.actions;
export default appSlice.reducer;
