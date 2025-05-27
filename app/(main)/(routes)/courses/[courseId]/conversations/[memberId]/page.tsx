import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    courseId: string;
    memberId: string;
  };
}

export default async function CourseMemberIdPage({
  params,
}: MemberIdPageProps) {
  const profile = await currentProfile();
  const { courseId, memberId } = await params;

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const currentMember = await db.member.findFirst({
    where: {
      courseId: courseId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId,
  );

  if (!conversation) {
    return redirect(`/courses/${courseId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type="conversation"
        courseId={courseId}
      />
    </div>
  );
}
