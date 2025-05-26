import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface CoursesIDPageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursesIDPage({ params }: CoursesIDPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = course?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }
  return redirect(`/courses/${params.courseId}/channels/${initialChannel.id}`);
}
