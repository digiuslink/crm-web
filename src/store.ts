import userReducer from "./pages/Users/userSlice";
import appReducer from "./core/appSlice";
import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./core/notificationSlice";
import configsReducer from "./core/configSlice";
import clientReducer from "./pages/Clients/clientSlice";
import clientsReducer from "./pages/Clients/clientsSlice";
import BlfReducer from "./pages/BLFs/blfSlice";
import packReducer from "./pages/BLFs/packSlice";
import paymentReducer from "./pages/Payments/paymentSlice";

export const store = configureStore({
  reducer: {
    client: clientReducer,
    clients: clientsReducer,
    notification: notificationReducer,
    configs: configsReducer,
    app: appReducer,
    user: userReducer,
    blf: BlfReducer,
    pack: packReducer,
    payment: paymentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
