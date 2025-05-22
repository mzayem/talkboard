"use client";

import CreateCourseModal from "@/components/modals/create-course-modal";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCourseModal />
    </>
  );
}
