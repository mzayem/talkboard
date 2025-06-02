import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import db from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";

import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/media-room";

interface MemberIdPageProps {
  params: Promise<{
    courseId: string;
    memberId: string;
  }>;
  searchParams: Promise<{
    video?: boolean;
  }>;
}

export default async function CourseMemberIdPage({
  params,
  searchParams,
}: MemberIdPageProps) {
  const profile = await currentProfile();
  const { courseId, memberId } = await params;
  const { video } = await searchParams;

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

  const conversation = (await getOrCreateConversation(
    currentMember.id,
    memberId,
  )) as Awaited<ReturnType<typeof getOrCreateConversation>>;

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
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            apiUrl={`/api/direct-messages`}
            paramKey="conversationId"
            paramValue={conversation.id}
            type="conversation"
            socketUrl={`/api/socket/direct-messages/`}
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
      {video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
    </div>
  );
}
