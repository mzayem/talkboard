"use client";

import { UserButton } from "@clerk/nextjs";

const ClientUserButton = () => {
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

export default ClientUserButton;
