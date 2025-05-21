import InitialModal from "@/components/modals/initial-modal";
import db from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const profile = await initialProfile();

  const course = await db.course.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (course) {
    return redirect(`/courses/${course.id}`);
  }

  return <InitialModal />;
}
