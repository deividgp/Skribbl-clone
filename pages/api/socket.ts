import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    res.end();
}