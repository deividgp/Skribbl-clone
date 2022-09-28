import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

export default function handler(
  req: NextApiRequest,
  res: any
) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
        res.end();
        return;
    }
    const io = new Server(res.socket.server);

    io.on("connection", socket => {
      console.log(socket.id);
      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
      socket.on('hola', msg => {
        console.log("hola222");
      })
    })

    res.socket.server.io = io;
    res.end();
}