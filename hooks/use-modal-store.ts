import { Channel, ChannelType, Course } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createCourse"
  | "invite"
  | "editCourse"
  | "members"
  | "createChannel"
  | "leaveCourse"
  | "deleteCourse"
  | "deleteChannel";

interface ModalData {
  course?: Course;
  channel?: Channel;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
