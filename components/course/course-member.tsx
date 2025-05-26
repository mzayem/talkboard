"use client";

import { cn } from "@/lib/utils";
import { Course, Member, MemberRole, Profile } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";

interface CourseMemberProps {
  member: Member & { profile: Profile };
  course: Course;
}

const roleIconMap = {
  [MemberRole.STUDENT]: null,
  [MemberRole.TEACHER]: (
    <ShieldCheck className="h-4 w-4 ml-auto text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-auto text-rose-500" />,
};

export default function CourseMember({ member, course }: CourseMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleClick = () => {
    router.push(`/courses/${params?.courseId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 "
        alt={member.profile.name}
      />
      {member.role !== MemberRole.STUDENT ? (
        <ActionTooltip label={member.profile.name}>
          <p
            className={cn(
              "truncate overflow-hidden whitespace-nowrap w-32 text-ellipsis",
              "text-sm font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
              params?.memberId === member.id &&
                "text-primary dark:text-zinc-200 dark:group-hover:text-white",
            )}
          >
            {member.profile.name}
          </p>
        </ActionTooltip>
      ) : (
        <p
          className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white",
          )}
        >
          {member.profile.name}
        </p>
      )}

      {icon}
    </button>
  );
}
