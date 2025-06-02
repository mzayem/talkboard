import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    const profile = await currentProfile();
    const { courseId } = await context.params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("CourseId is Missing", { status: 400 });
    }
    const course = await db.course.delete({
      where: {
        id: courseId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    const { courseId } = await context.params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("CourseId is Missing", { status: 400 });
    }
    const course = await db.course.update({
      where: {
        id: courseId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
