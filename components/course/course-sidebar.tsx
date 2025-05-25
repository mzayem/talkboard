import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";

import { ScrollArea } from "@/components/ui/scroll-area";

import CourseHeader from "./course-header";
import CourseSearch from "./course-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface CourseSidebarProps {
  courseId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleMap = {
  [MemberRole.STUDENT]: null,
  [MemberRole.TEACHER]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <CourseSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
