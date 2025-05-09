import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { Mutex } from "async-mutex";
import { logoutUser, setAccess } from "../slices/userSlice";


const mutex = new Mutex();
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL });

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs | any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult: any = await baseQuery(
          {
            url: "/auth/jwt/refresh/",
            method: "POST",
            body: {
              refresh: JSON.parse(
                JSON.parse(
                  localStorage.getItem("persist:django-react-pizza") || ""
                ).userSlice
              ).refresh,
            },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(setAccess(refreshResult.data.access));
        } else {
          api.dispatch(logoutUser());
        }

        // if (result.meta?.request.url.endsWith('create-checkout-session/')) {
        //     args.headers.Authorization = `JWT ${refreshResult.data.access}`
        //     result = await baseQuery(args, api, extraOptions)
        // }
        // } else {
        // }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
