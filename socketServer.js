const server = require('http').createServer();
const io = require('socket.io-client')(server, {
  cors: {
    origin: '*',
  },
});

const PORT = 5001;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('addTask', (task) => {
    io.emit('taskAdded', task);
  });

  socket.on('updateTask', (task) => {
    io.emit('taskUpdated', task);
  });

  socket.on('deleteTask', (taskId) => {
    io.emit('taskDeleted', taskId);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
