import db from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-11">
      <h1 className="text-center text-3xl text-indigo-500 font-bold">
        Create a Server
      </h1>
      <p>
        this is a virtual classroom for learning purpose. you can join the class
        and learn from the teacher.
      </p>
    </div>
  );
}
