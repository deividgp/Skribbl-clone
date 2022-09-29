import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

let names:string[] = [];
let word: string;

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
    res.socket.server.io = io;

    io.use((socket: any, next) => {
      socket.username = socket.handshake.auth.username;
      next();
    });

    io.on("connection", (socket: any) => {
      console.log("connect");
      if(socket.username == undefined)
        return;
      
      names.push(socket.username);
      console.log(names);
      io.sockets.emit("users", names);
      
      socket.on('input-change', (msg: any) => {
        socket.broadcast.emit('update-input', msg)
      });

      socket.on('new_word', (msg: any) => {
        console.log("hola222");
      });

      

      socket.on("disconnect", () => {
        let index = names.indexOf(socket.username);
        if (index !== -1) {
          names.splice(index, 1);
          io.sockets.emit("users", names);
        }
      });
    })

    res.end();
}