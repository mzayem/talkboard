import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface CoursesIDPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursesIDPage({ params }: CoursesIDPageProps) {
  const profile = await currentProfile();
  const { courseId } = await params;

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
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
  return redirect(`/courses/${courseId}/channels/${initialChannel.id}`);
}
