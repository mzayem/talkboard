// app/api/uploadthing/delete/route.ts
import { utapi } from "@/server/uploadthing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { key } = await req.json(); // 👈 now reading `key`

    if (!key) {
      return new NextResponse("File key is required", { status: 400 });
    }

    const res = await utapi.deleteFiles(key);

    if (res?.success) {
      return NextResponse.json({ success: true });
    }

    return new NextResponse("Failed to delete file", { status: 500 });
  } catch (error) {
    console.error("[UPLOADTHING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
