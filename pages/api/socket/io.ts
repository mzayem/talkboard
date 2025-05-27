import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer = res.socket.server as NetServer & {
      io: ServerIO | undefined;
    };
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    httpServer.io = io;
  }

  res.end();
};

export default ioHandler;
