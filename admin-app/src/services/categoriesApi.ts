import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<ApiResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    addCategory: builder.mutation<
      ApiResponse,
      { title: string; description: string }
    >({
      query: (categoryData) => ({
        url: `/categories`,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      ApiResponse,
      { id: number; title: string; description: string }
    >({
      query: ({ id, title, description }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: { title, description },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<ApiResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = authApi;
