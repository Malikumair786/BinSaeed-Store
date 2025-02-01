import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { title: string; description: string };
  setFormData: (formData: { title: string; description: string }) => void;
  handleSubmit: () => void;
  isFormUpdated: boolean;
  isUpdate: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleSubmit,
  isFormUpdated,
  isUpdate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          {isUpdate ? "Update Category" : "Add Category"}
        </DialogTitle>
        <DialogDescription>
          {isUpdate
            ? "Update category title or description"
            : "Add the title and description of the category."}
        </DialogDescription>
        <div className="space-y-4">
          <div className="grid items-center gap-4">
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="grid items-center gap-4">
            <Textarea
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="w-auto text-sm rounded-md bg-transparent text-primary hover:bg-transparent hover:text-primary"
            onClick={handleSubmit}
            disabled={isUpdate && !isFormUpdated}
          >
            {isUpdate ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
