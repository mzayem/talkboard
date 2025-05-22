import { Course, Member, Profile } from "@prisma/client";

export type CourseWithMembersWithProfile = Course & {
  members: Member & { profile: Profile }[];
};
