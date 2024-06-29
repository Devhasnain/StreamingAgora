const http = require("http");
const app = require("./app");
const connectDB = require("./utliz/connectDB");
const socketServer = require("./socketServer");
const server = http.createServer(app);
const io = require("socket.io")(server);

server.listen(3001);
server.on("listening", () => {
  try {
    console.log("server is up...");
    connectDB();
  } catch (error) {}
});
socketServer(io);
