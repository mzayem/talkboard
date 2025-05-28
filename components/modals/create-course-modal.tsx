"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Classroom name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Classroom image is required",
  }),
});

export default function CreateCourseModal() {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createCourse";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/courses", values);

      form.reset();
      router.refresh();
      onClose();
      toast.success("Course Created");
    } catch (error) {
      console.log(error);
    }
  };

  const extractKeyFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleClose = async () => {
    const values = form.getValues();

    if (!values.imageUrl) {
      form.reset();
      onClose();
      return;
    }

    try {
      const key = extractKeyFromUrl(values.imageUrl);
      form.reset();
      onClose();
      await fetch("/api/uploadthing/delete", {
        method: "POST",
        body: JSON.stringify({ key }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Image deletion failed:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your virtual classroom
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your classroom a Name and choose an Image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8  px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="courseImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
                    dark:text-secondary/70"
                    >
                      Classroom Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/80 border-0 
                        focus-visible:ring-0
                        focus-visible:ring-offset-0
                        dark:bg-zinc-300/80"
                        placeholder="Enter classroom Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
