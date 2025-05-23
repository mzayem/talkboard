"use client";

import { CourseWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface CourseHeaderProps {
  course: CourseWithMembersWithProfile;
  role?: MemberRole;
}

export default function CourseHeader({ course, role }: CourseHeaderProps) {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isTeacher = isAdmin || role === MemberRole.TEACHER;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md font-semibold px-3 flex
            items-center h-12 border-neutral-200 
            dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
            dark:hover:bg-zinc-700/50 transition"
        >
          {course.name}
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-md w-56 text-xs font-medium text-black
        dark:text-neutral-400 space-y-[2px]"
      >
        {isTeacher && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { course: course })}
            className="text-indigo-600 dark:text-indigo-400 
            px-3 py-2 text-sm cursor-pointer "
          >
            Invite People
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("editCourse", { course })}
          >
            Course Settings
            <Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer ">
            Manage Members
            <Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isTeacher && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer ">
            Create Channels
            <PlusCircle className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isTeacher && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500  px-3 py-2 text-sm cursor-pointer ">
            Delete Course
            <Trash className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500  px-3 py-2 text-sm cursor-pointer ">
            Leave Course
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
