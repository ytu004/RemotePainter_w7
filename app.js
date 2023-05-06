const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
