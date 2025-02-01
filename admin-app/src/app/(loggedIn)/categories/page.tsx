"use client";

import React, { useEffect, useState } from "react";
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/categoriesApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { X, SquarePen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategoryDialog from "./CategoryDialog";

interface Category {
  id: number;
  title: string;
  description: string;
}

export default function Categories() {
  const { data, isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [addCategory] = useAddCategoryMutation();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [initialFormData, setInitialFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedCategory = [...categories].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(sortedCategory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategory.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    if (data?.success && data.data) {
      setCategories(data.data);
    } else {
      setCategories([]);
    }
  }, [data]);

  const handleUpdate = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ title: category.title, description: category.description });
    setInitialFormData({
      title: category.title,
      description: category.description,
    });
    setIsUpdate(true);
    setOpenDialog(true);
  };

  const handleAddDialogForm = () => {
    setFormData({ title: "", description: "" });
    setIsUpdate(false);
    setOpenDialog(true);
  };

  const handleFormSubmit = async () => {
    const { title, description } = formData;

    if (!title || !description) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "error",
      });
      return;
    }
    if (isUpdate && selectedCategory) {
      try {
        const response = await updateCategory({
          id: selectedCategory.id,
          ...formData,
        }).unwrap();
        setCategories(
          categories.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, ...formData }
              : category
          )
        );
        toast({
          title: "Updated",
          description: response.message || "Updated successfully",
          variant: "success",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update category",
          variant: "destructive",
        });
      } finally {
        setOpenDialog(false);
        setSelectedCategory(null);
        setFormData({ title: "", description: "" });
      }
    } else {
      try {
        const response = await addCategory({
          title: formData.title,
          description: formData.description,
        }).unwrap();
        toast({
          title: "Added",
          description: response.data?.message || "Added successfully",
          variant: "success",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to add category",
          variant: "destructive",
        });
      } finally {
        setOpenDialog(false);
        setFormData({ title: "", description: "" });
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (categoryToDelete) {
        const response = await deleteCategory({
          id: categoryToDelete,
        }).unwrap();
        setCategories(
          categories.filter((category) => category.id !== categoryToDelete)
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
        description: error.message || "Failed to delete category",
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
    formData.title !== initialFormData.title ||
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
          Add Category
        </Button>
      </div>
      <div className="px-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.title}</TableCell>
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
                  {category.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-4">
                    <SquarePen
                      className="cursor-pointer"
                      onClick={() => handleUpdate(category)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <X
                          className="cursor-pointer"
                          onClick={() => setCategoryToDelete(category.id)}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this category? This
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

      <CategoryDialog
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
