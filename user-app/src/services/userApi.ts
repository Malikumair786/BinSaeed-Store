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

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse, RegisterRequest>({
      query: (userData) => ({
        url: "user",
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
  }),
});

export const { useSignupMutation, useSignupInfoMutation } = authApi;
