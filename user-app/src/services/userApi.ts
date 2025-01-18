import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse, RegisterRequest>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
    }),
    signupInfo: builder.mutation<
      ApiResponse,
      { userId: string; phoneNo: string; address: string }
    >({
      query: (userData) => ({
        url: `auth/update-user-info/${userData.userId}`,
        method: "PUT",
        body: userData,
      }),
    }),
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
    checkRegistrationStatus: builder.query<any, void>({
      query: () => ({
        url: `/auth/registration-status`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSignupInfoMutation,
  useMeQuery,
  useChangePasswordMutation,
  useCheckRegistrationStatusQuery,
} = authApi;
