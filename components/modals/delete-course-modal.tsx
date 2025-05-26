"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function DeleteCourseModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteCourse";
  const { course } = data;

  const [isLoading, setIsLoading] = useState(false);

  const extractKeyFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const onClick = async () => {
    if (!course) {
      toast.error("Invalid course data");
      return;
    }

    const key = extractKeyFromUrl(course.imageUrl);

    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${course?.id}`);

      await fetch("/api/uploadthing/delete", {
        method: "POST",
        body: JSON.stringify({ key }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      onClose();
      router.refresh();
      router.push("/");
      toast.success("You have deleted the course");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Course
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            <span className="font-semibold text-indigo-500">
              {course?.name + " "}
            </span>
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"primary"}
              onClick={onClick}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
