const http = require('http');
const connectDB = require('./config/db.config');
const app = require('./app');
const {initSocket} = require('./socket.js');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
initSocket(server)
connectDB()
.then(()=>{
    server.listen(PORT, () => {
    console.log(`Server is Running on PORT : ${PORT}`);
})
})
.catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});
