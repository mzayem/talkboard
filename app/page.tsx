"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-11">
      <p className="text-center text-3xl text-indigo-500 font-bold">
        Hello Virtual Classroom
      </p>
      <Button onClick={() => alert("hello class!")}>Join Class</Button>
    </div>
  );
}
