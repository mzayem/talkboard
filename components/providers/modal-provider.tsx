"use client";

import { useEffect, useState } from "react";

import CreateCourseModal from "@/components/modals/create-course-modal";
import InviteModal from "@/components/modals/invite-modal";
import EditCourseModal from "@/components/modals/edit-course-modal";
import MembersModal from "@/components/modals/members-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import LeaveCourseModal from "@/components/modals/leave-course-modal";
import DeleteCourseModal from "@/components/modals/delete-course-modal";
import DeleteChannelModal from "@/components/modals/delete-channel-modal";

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
      <CreateChannelModal />
      <LeaveCourseModal />
      <DeleteCourseModal />
      <DeleteChannelModal />
    </>
  );
}
