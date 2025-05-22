import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import CourseHeader from "./course-header";

interface CourseSidebarProps {
  courseId: string;
}

export default async function CourseSidebar({ courseId }: CourseSidebarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = course?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = course?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = course?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = course?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  if (!course) {
    return redirect("/");
  }

  const role = course.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <div
      className="flex flex-col h-full w-full text-primary 
        dark:bg-[#2B2D31] bg-[#F2F3F5]"
    >
      <CourseHeader course={course} role={role} />
    </div>
  );
}
