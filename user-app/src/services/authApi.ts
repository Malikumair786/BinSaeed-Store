import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: `/auth/forgot-password/${email}`,
        method: "GET",
      }),
    }),
    validateResetPasswordLink: builder.mutation<
      ApiResponse,
      { token: string; key: string }
    >({
      query: ({ token, key }) => ({
        url: `/auth/validate-link`,
        method: "POST",
        body: { token, key },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { password: string; token: string; key: string }
    >({
      query: ({ password, token, key }) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: { password, token, key },
      }),
    }),
    verifyAccountEmail: builder.mutation<
      ApiResponse,
      { token: string; key: string }
    >({
      query: ({ token, key }) => ({
        url: `/auth/verify`,
        method: "POST",
        body: { token, key },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useValidateResetPasswordLinkMutation,
  useResetPasswordMutation,
  useVerifyAccountEmailMutation,
} = authApi;
