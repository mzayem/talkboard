"use client";

import { ChannelType, MemberRole } from "@prisma/client";

import { CourseWithMembersWithProfile } from "@/types";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

import ActionTooltip from "@/components/action-tooltip";

interface CourseSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  course?: CourseWithMembersWithProfile;
}

export default function CourseSection({
  label,
  role,
  sectionType,
  channelType,
  course,
}: CourseSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2 ">
      <p
        className="text-xs uppercase font-semibold
         text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </p>
      {role !== MemberRole.STUDENT && sectionType === "channels" && (
        <ActionTooltip label="create channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 
          dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage members" side="top">
          <button
            onClick={() => onOpen("members", { course })}
            className="text-zinc-500 hover:text-zinc-600 
          dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
