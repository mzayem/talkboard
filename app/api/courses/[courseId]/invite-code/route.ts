import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const profile = await currentProfile();
    const { courseId } = await params;

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
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
