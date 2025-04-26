import React, { Dispatch, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SquarePlus, SquareX } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetAllCategoriesQuery } from "@/services/categoriesApi";

interface Variants {
  name: string;
  price: number;
}
interface FormData {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  tags: string[];
  variants: Variants[];
  images: File[];
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: () => void;
  isFormUpdated: boolean;
  isUpdate: boolean;
}
interface Category {
  id: number;
  title: string;
  description: string;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onOpenChange, formData, setFormData, handleSubmit, isFormUpdated, isUpdate }) => {
  const { data: categoriesData, isLoading: isSubjectsLoading } = useGetAllCategoriesQuery();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categoriesData?.success && categoriesData.data) {
      setCategories(categoriesData.data);
    } else {
      setCategories([]);
    }
  }, [categoriesData]);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, tags: e.target.value.split(",").map((tag) => tag.trim()) });
  };

  const handleVariantChange = (index: number, field: keyof Variants, value: string | number) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleAddVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { name: "", price: 0 }] });
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({ ...formData, images: filesArray });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{isUpdate ? "Update Product" : "Add Product"}</DialogTitle>
        <DialogDescription>{isUpdate ? "Update product details" : "Enter new product details"}</DialogDescription>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">

            <div>
            <Input type="number" placeholder="CategoryId" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })} />
            {/* <Select
                value={
                  formData.categoryId !== 0 ? formData.categoryId : ""
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.categoryId === 0 ? "Select Subject" : undefined
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            <div>
              <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            </div>
          </div>

          <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <Input required placeholder="Tags (e.g. electronics, gadgets)" value={formData.tags.join(",")} onChange={handleTagChange} />

          <Input type="file" multiple onChange={handleImageChange} />
          {formData.images.length > 0 && <p className="text-sm">Selected: {formData.images.length} file(s)</p>}

          <div className="mt-4">
            <div className="flex justify-between">
              <Label className="mt-3">Product Variants</Label>
              <Button variant="outline" onClick={handleAddVariant} className="">
                <SquarePlus />
              </Button>
            </div>
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex gap-2">
                <Input placeholder="Variant Name" value={variant.name} onChange={(e) => handleVariantChange(index, "name", e.target.value)} />
                <Input type="number" placeholder="Price" value={variant.price} onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))} />
                <Button variant="destructive" onClick={() => handleRemoveVariant(index)}>
                  <SquareX />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-auto text-sm rounded-md bg-transparent text-primary hover:bg-transparent hover:text-primary" onClick={handleSubmit} disabled={isUpdate && !isFormUpdated}>
            {isUpdate ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
