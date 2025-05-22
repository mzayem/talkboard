// components/navigation/client-user-button.tsx
"use client";

import { UserButton } from "@clerk/nextjs";

export const ClientUserButton = () => {
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
};
