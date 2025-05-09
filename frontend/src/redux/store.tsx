import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { BaseApi } from "./api/baseApi";
import modalSlice from "./slices/modalSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

  
const persistConfig = {
  key: "django-react-pizza",
  storage,
  whitelist: ["cartSlice", "userSlice"],
};

const reducers = combineReducers({
  userSlice,
  modalSlice,
  cartSlice,
  [BaseApi.reducerPath]: BaseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(BaseApi.middleware),
  devTools: import.meta.env.VITE_DEV_TOOLS !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
