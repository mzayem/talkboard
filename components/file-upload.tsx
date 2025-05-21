"use client";

import { UploadDropzone } from "@/lib/uploadthing";

import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "classImage" | "messageFile";
}

export default function FileUpload({
  onChange,
  value,
  endpoint,
}: FileUploadProps) {
  const fileType = value?.split(".").pop();
  const [isLoading, setIsLoading] = useState(false);

  const extractKeyFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1]; // Extracts file key
  };

  const onDelete = async () => {
    if (!value) return;

    setIsLoading(true);
    const key = extractKeyFromUrl(value);

    try {
      const res = await fetch("/api/uploadthing/delete", {
        method: "POST",
        body: JSON.stringify({ key }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        onChange("");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (value && fileType !== "pdf" && fileType !== "mp4") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={onDelete}
          className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"} text-white bg-rose-500 p-1 rounded-full absolute top-0 right-0 shadow-sm border-white border-2`}
          type="button"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
        }}
      />
    </div>
  );
}
