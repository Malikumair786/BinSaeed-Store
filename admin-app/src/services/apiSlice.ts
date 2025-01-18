import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_APP_API_URL}`,
    prepareHeaders: (headers) => {
      const accessToken = Cookies.get("access_token_admin");
      headers.set("Authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});

export default apiSlice;
