"use client";

import { z } from "zod";
import axios from "axios";
import { cn } from "@/lib/utils";
import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import {
  Edit,
  FileIcon,
  FileText,
  FolderArchive,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { getFileType } from "@/lib/file-type";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

interface chatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl?: string;
  fileName?: string;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  STUDENT: null,
  TEACHER: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export default function ChatItems({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  fileName,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: chatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/courses/${params?.courseId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const asciiCode = e.key.length === 1 ? e.key.charCodeAt(0) : null;

      if (e.key === "Escape" || asciiCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({ content: content });
  }, [form, content]);

  const fileType = fileName ? getFileType(fileName) : "unknown";

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isTeacher = currentMember.role === MemberRole.TEACHER;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isTeacher || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isVideo = fileType === "video" && fileUrl;
  const isAudio = fileType === "audio" && fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isText = fileType === "text" && fileUrl;
  const isArchive = fileType === "zip" && fileUrl;
  const isImage = fileType === "image" && fileUrl;

  return (
    <div
      className="relative group flex items-center hover:bg-black/5 
    p-4 transition w-full"
    >
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} alt={member.profile.name} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="ext-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isAudio && (
            <div className="relative flex items-center p-2 mt-2 rounded-md w-3/4 md:w-2/4 ">
              <audio controls className="w-full">
                <source src={fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {isVideo && (
            <div className="relative flex items-center p-2 mt-2 rounded-md w-3/4">
              <video
                controls
                width={500}
                className="rounded-md border shadow-md"
              >
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {(isText || isArchive || isPDF) && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              {isText ? (
                <FileText className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              ) : isArchive ? (
                <FolderArchive className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              ) : isPDF ? (
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              ) : null}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {fileName}
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 bt-2 mt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90
                            dark:bg-zinc-700/75 border-none border-0
                            focus-visible:ring-0
                            focus-visible:ring-offset-0 text-zinc-600 
                            dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  {isLoading && <Loader2 className="h-2 w-2 animate-spin" />}
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
