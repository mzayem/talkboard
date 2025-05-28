"use client";

import { getFileType } from "@/lib/file-type";
import { UploadDropzone } from "@/lib/uploadthing";

import {
  FileAudio,
  FileIcon,
  FileText,
  FolderArchive,
  LoaderCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps {
  onChange: (url?: string, name?: string) => void;
  name?: string;
  value?: string;
  endpoint: "courseImage" | "messageFile";
}

export default function FileUpload({
  onChange,
  name,
  value,
  endpoint,
}: FileUploadProps) {
  const fileType = name ? getFileType(name) : "unknown";
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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

  if ((fileType === "image" || fileType === "unknown") && value) {
    return (
      <div className="relative h-20 w-20">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full z-10">
            <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
        <Image
          fill
          src={value || ""}
          alt="Upload"
          className={`rounded-full object-cover ${imageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
          onLoadingComplete={() => setImageLoading(false)}
        />
        <button
          onClick={onDelete}
          disabled={isLoading}
          className={`${
            isLoading
              ? "cursor-not-allowed bg-rose-400"
              : "bg-rose-500 cursor-pointer"
          } text-white p-1 rounded-full absolute top-0 right-0 shadow-sm border-white border-2 z-20`} // z-20 added
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

  if (value && fileType !== "image") {
    return (
      <div className="relative flex justify-between items-center p-2 mt-2 rounded-md bg-background/10">
        {fileType === "video" ? (
          <video controls width={500} className="rounded-md border shadow-md">
            <source src={value} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : fileType === "audio" ? (
          <FileAudio className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        ) : fileType === "text" ? (
          <FileText className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        ) : fileType === "zip" ? (
          <FolderArchive className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        ) : (
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        )}
        {fileType !== "video" && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            {name}
          </a>
        )}
        <button
          onClick={onDelete}
          disabled={isLoading}
          className={`${
            isLoading
              ? "cursor-not-allowed bg-rose-400"
              : "bg-rose-500 cursor-pointer"
          } text-white p-1 rounded-full absolute -top-3 -right-3 shadow-sm border-white border-2 z-20`}
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
          onChange(res?.[0].ufsUrl, res?.[0].name);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
        }}
      />
    </div>
  );
}
