const {
  insertChatHistory,
  setUserOnline,
  setUserOffline,
  getUserSocketId,
} = require("./utliz/socketFunctions.js");

const { socketMiddleware } = require("./utliz/auth");
const socketServer = (io) => {
  io.use(socketMiddleware);

  // Socket.io logic
  io.on("connection", (socket) => {
    
    socket.on("connected", (data) => {
      console.log("connected user", socket.id);
      setUserOnline({
        userId: data?.userId,
        socketId: socket?.id,
      });
    });

    socket.on("send-message", async (data) => {
      let message = await insertChatHistory(data);

      let receipt = await getUserSocketId({ userId: data.to });

      io.to(socket.id).emit("message-delivered", message);

      if (receipt) {
        io.to(receipt?.socketId).emit("new-message", message);
      }
    });


    socket.on("call-user", async (data) => {
      console.log(data)
    })



    socket.on("disconnect", () => {
      console.log('user disconnected',socket.id)
      setUserOffline({ socketId: socket.id });
    });
  });
};

module.exports = socketServer;
