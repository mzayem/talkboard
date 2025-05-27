import CourseSidebar from "@/components/course/course-sidebar";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
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
  });

  if (!course) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div
        className="hidden md:flex h-full w-60 z-20
        flex-col fixed inset-y-0 "
      >
        <CourseSidebar courseId={courseId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default CourseIdLayout;
