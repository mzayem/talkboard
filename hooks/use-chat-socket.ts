import { useSocket } from "@/components/providers/socket-provider";
import { Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: {
    profile: Profile;
  };
};

export function useChatSocket({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const querClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      querClient.setQueriesData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((pages: any) => {
          return {
            ...pages,
            items: pages.items.map((items: MessageWithMemberWithProfile) => {
              if (items.id === message.id) {
                return message;
              }
              return items;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      querClient.setQueriesData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return { ...oldData, pages: newData };
      });
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [querClient, socket, addKey, updateKey, queryKey]);
}
