"use client";

import React, { useEffect, useState } from "react";
import { useGetAllProductsQuery, useDeleteProductMutation, useAddProductMutation, useUpdateProductMutation, useUploadImagesMutation } from "@/services/productApi";
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { X, SquarePen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductDialog from "./ProductDialog";



interface Variants {
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number,
  categoryId: number,
  tags: string[],
  variants: Variants[],
  images: File[]
}

export default function Categories() {
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [addProduct] = useAddProductMutation();
  const [uploadImageToS3] = useAddProductMutation();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    tags: [],
    variants: [],
    images: []
  });
  const [initialFormData, setInitialFormData] = useState({
    id: 0,
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    tags: [],
    variants: [],
    images: []
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedProduct = [...categories].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  const totalPages = Math.ceil(sortedProduct.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProduct.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    if (data?.success && data.data) {
      setCategories(data.data);
    } else {
      setCategories([]);
    }
  }, [data]);

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsUpdate(true);
    setOpenDialog(true);
  };

  const handleAddDialogForm = () => {
    setFormData(initialFormData);
    setIsUpdate(false);
    setOpenDialog(true);
  };
  
  const handleFormSubmit = async () => {
    // try { 
      console.log("Handle Form submit clicked")
      // let uploadedImageUrls: string[] = [];

      // if (formData.images.length > 0 && formData.images[0] instanceof File) {
      //   const uploadPromises = formData.images.map(async (file: any) => {
      //     const response = await uploadImageToS3(file);
      //     return response.data;
      //   });

      //   uploadedImageUrls = await Promise.all(uploadPromises);
      // }

      // const productData = {
      //   id: formData.id,
      //   name: formData.name,
      //   description: formData.description,
      //   price: formData.price,
      //   categoryId: formData.categoryId,
      //   tags: formData.tags,
      //   variants: formData.variants,
      //   images: uploadedImageUrls,
      // };

      // let response;
      // if (isUpdate) {
      //   response = await updateProduct(productData).unwrap();
      //   toast({
      //     title: "Updated",
      //     description: response.message || "Updated successfully",
      //     variant: "success",
      //   });
      // } else {
      //   response = await addProduct(productData).unwrap();
      //   toast({
      //     title: "Added",
      //     description: response.message || "Added successfully",
      //     variant: "success",
      //   });
      // } 
    // } catch (error) {
    //   console.error("Error submitting product:", error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to submit product",
    //     variant: "destructive",
    //   });
    // }
  };
  

  const handleConfirmDelete = async () => {
    try {
      if (productToDelete) {
        const response = await deleteProduct({
          id: productToDelete,
        }).unwrap();
        setCategories(
          categories.filter((product) => product.id !== productToDelete)
        );
        toast({
          title: "Deleted",
          description: response.message || "Deleted successfully",
          variant: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const isFormUpdated =
    formData.name !== initialFormData.name ||
    formData.description !== initialFormData.description;

  if (isLoading) {
    return (
      <div className="flex align-middle justify-center m-auto">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={handleAddDialogForm}
          className="bg-white text-primary text-sm hover:bg-white hover:text-primary rounded-md w-[100%] md:w-[10%]"
        >
          Add Product
        </Button>
      </div>
      <div className="px-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>tags</TableHead>
              {/* <TableHead>Variants</TableHead> */}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                {/* <TableCell> */}
                <TableCell
                  className="max-w-lg overflow-hidden text-ellipsis whitespace-normal"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    maxHeight: "3rem",
                  }}
                >
                  {product.description}
                </TableCell>
                <TableCell>{product.tags.join(", ")}</TableCell>

                <TableCell>
                  <div className="flex space-x-4">
                    <SquarePen
                      className="cursor-pointer"
                      onClick={() => handleUpdate(product)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <X
                          className="cursor-pointer"
                          onClick={() => setProductToDelete(product.id ?? null )}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this product? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="w-auto bg-transparent text-primary hover:bg-transparent hover:text-primary text-sm rounded-md"
                            onClick={handleConfirmDelete}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end items-center mt-4 space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`bg-white text-primary text-sm hover:bg-white hover:text-primary w-full md:w-[8%] rounded-md  ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-black"
            }`}
          >
            Previous
          </Button>
          <span className="text-lg w-full  md:w-fit">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`bg-white text-primary text-sm hover:bg-white hover:text-primary w-full md:w-[8%] rounded-md ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-black"
            }`}
          >
            Next
          </Button>
        </div>
      </div>

      <ProductDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleFormSubmit}
        isFormUpdated={isFormUpdated}
        isUpdate={isUpdate}
      />
    </>
  );
}
