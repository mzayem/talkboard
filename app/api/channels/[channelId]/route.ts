import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      channelId: string;
    }>;
  },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const courseId = searchParams.get("courseId");
    const { channelId } = await context.params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Course ID is missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.TEACHER],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      channelId: string;
    }>;
  },
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const courseId = searchParams.get("courseId");
    const { channelId } = await context.params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Course ID is missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be general", { status: 400 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.TEACHER],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
