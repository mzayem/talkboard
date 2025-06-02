"use client";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function ClientUserButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "h-[48px] w-[48px]",
        },
      }}
    />
  );
}
