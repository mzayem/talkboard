"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-11">
      <h1 className="text-center text-3xl text-indigo-500 font-bold">
        Hello Virtual Classroom
      </h1>
      <p>
        this is a virtual classroom for learning purpose. you can join the class
        and learn from the teacher.
      </p>
      <UserButton />

      <Button onClick={() => alert("hello class!")}>Join Class</Button>
    </div>
  );
}
