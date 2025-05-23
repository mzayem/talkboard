"use client";

import { useEffect, useState } from "react";

import CreateCourseModal from "@/components/modals/create-course-modal";
import InviteModal from "@/components/modals/invite-modal";
import EditCourseModal from "@/components/modals/edit-course-modal";
import MembersModal from "@/components/modals/members-modal";

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
      <EditCourseModal />
      <MembersModal />
    </>
  );
}
