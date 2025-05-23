"use client";

import { useEffect, useState } from "react";

import CreateCourseModal from "@/components/modals/create-course-modal";
import InviteModal from "@/components/modals/invite-modal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCourseModal />
      <InviteModal />
    </>
  );
}
