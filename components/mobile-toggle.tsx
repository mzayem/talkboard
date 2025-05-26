import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import CourseSidebar from "@/components/course/course-sidebar";
import { DialogTitle } from "./ui/dialog";

export default function MobileToggle({ courseId }: { courseId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex-row  p-0 gap-0">
        <DialogTitle className="sr-only">Sidebar Menu</DialogTitle>
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <CourseSidebar courseId={courseId} />
      </SheetContent>
    </Sheet>
  );
}
