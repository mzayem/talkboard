import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const { inviteCode } = await params;

  if (!inviteCode) {
    return redirect("/");
  }

  const existingCourse = await db.course.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingCourse) {
    return redirect(`/courses/${existingCourse.id}`);
  }

  const course = await db.course.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (course) {
    return redirect(`/courses/${course.id}`);
  }

  return null;
}
