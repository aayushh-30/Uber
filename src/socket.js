const socketIO = require('socket.io')
const User = require('./models/user.model.js')
const Captain = require('./models/captain.model.js')

let io;
function initSocket(httpServer) {
    io = socketIO(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    io.on('connection', (socket) => {
        socket.on("join",async(data)=>{
            const {userId, userType} = data
        if(userType === "user"){
            await User.findIdAndUpdate(userId, {socketId:socket.id});
        }else if(userType === "captain"){
            await Captain.findIdAndUpdate(userId, {socketId:socket.id});
        }else{
            return
        }
        });

        socket.on("update-location-captain", async(data)=>{
            const {userId, location} = data;
            await Captain.findIdAndUpdate(userId, {location:{
                ltd:location.ltd,
                lng:location.lng
            }});
        })

        socket.on("disconnect",async(data)=>{
            console.log("user disconnected");
        })
    })
}

const sendMessageToSocketId = (socketId, message) => {
    if(!io) return 
    io.to(socketId).emit(message.event, message.data);
  };

module.exports = {
    initSocket,
    sendMessageToSocketId
}