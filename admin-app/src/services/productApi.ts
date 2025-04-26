import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}
interface Variants {
  name: string;
  price: number;
}

interface AddProductRequest {
  name: string;
  description: string;
  price: number,
  categoryId: number,
  tags: string[],
  variants: Variants[],
  images: string[];
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ApiResponse, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation< ApiResponse, AddProductRequest>({
      query: (productData) => ({
        url: `/products`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    uploadImages: builder.mutation<ApiResponse, File[]>({
      query: (File) => ({
        url: `/products/images`,
        method: "POST",
        body: File,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<ApiResponse, { id: number } & AddProductRequest >({
      query: (productData) => ({
        url: `/products/${productData.id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<ApiResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadImagesMutation
} = authApi;
