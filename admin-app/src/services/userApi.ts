import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<ApiResponse, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "users/change-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useChangePasswordMutation,
  useCheckRegistrationStatusQuery,
} = authApi;
