import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";

import NavigationAction from "@/components/navigation/navigation-action";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/navigation-item";
import SafeUserButton from "@/components/safeUserButton";

export default async function NavigationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div
      className="space-y-4 flex flex-col items-center
        h-full text-primary w-full bg-[#E3E4E8] dark:bg-[#1E1F22]
        py-3"
    >
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700
      rounded-md w-10 mx-auto"
      />

      <ScrollArea className="flex w-full">
        {courses.map((course) => (
          <div key={course.id} className="mb-4">
            <NavigationItem
              id={course.id}
              name={course.name}
              imageUrl={course.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <SafeUserButton />
      </div>
    </div>
  );
}
