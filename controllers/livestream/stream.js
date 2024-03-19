// server.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, { debug: true });

function startLive() {
  app.use(express.static('public'));
  app.use('/peerjs', peerServer);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('user-connected', socket.id);

      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
      });
    });

    socket.on('offer', (offer, to) => {
      io.to(to).emit('offer', offer);
    });

    socket.on('answer', (answer, to) => {
      io.to(to).emit('answer', answer);
    });

    socket.on('ice-candidate', (iceCandidate, to) => {
      io.to(to).emit('ice-candidate', iceCandidate);
    });
  });
}

module.exports = { startLive };
