import { createApi  } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseFetch";
//import { baseQueryWithReauth } from "./baseFetch";

// initialize an empty api service that we'll inject endpoints into later as needed
export const BaseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['user'],
  endpoints: () => ({}),
});

export const baseHeadersOptions = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
