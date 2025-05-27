import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { Course, Member, Profile } from "@prisma/client";

export type CourseWithMembersWithProfile = Course & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};
