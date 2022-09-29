import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { Message, User } from "../../types";

const names:string[] = [];
const messages:string[] = [];
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
      if(socket.username == undefined)
        return;
      
      names.push(socket.username);
      io.sockets.emit("users", names);
      
      socket.on('input-change', (data: any) => {
        socket.broadcast.emit('update-input', data)
      });

      socket.on('new_word', (data: any) => {

      });

      socket.on("get_messages", (data: any) => {
        socket.emit("receive_messages", messages);
      });

      socket.on("send_message", (data: any) => {
        socket.broadcast.emit("receive_message", data);
        messages.push(data);
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