import { BaseApi, baseHeadersOptions } from "./baseApi";

// Define a service using a base URL and expected endpoints
export const userApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/jwt/create/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    loginUserWithGoogle: builder.mutation({
      query: ({ authorizationCode }) => ({
        url: "/api/user/login-with-google/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({
          code: authorizationCode
        }),
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/auth/users/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/users/reset_password/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(email),
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: (data) => ({
        url: "/auth/users/reset_password_confirm/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    ActivationAccount: builder.mutation({
      query: (data) => ({
        url: "/auth/users/activation/",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    logoutUser: builder.mutation({
      query: (token) => ({
        url: "/api/user/logout/",
        method: "POST",
        headers: baseHeadersOptions,
        body: {
          refresh: token,
        },
      }),
    }),
  }),
});

export const { 
    useLoginUserMutation,
    useLoginUserWithGoogleMutation,
    useCreateUserMutation,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
    useActivationAccountMutation,
    useLogoutUserMutation
 } = userApi;
