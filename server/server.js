const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gridRoutes = require('./routes/grid-routes');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join('public')));


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

const server = http.createServer(app);
const io = socketIo(server,{ origins: '*:*'});
io.on('connection', socket => {
    socket.on('joinRoom', (roomId) => {
        if(socket.rooms.has(roomId)){
            io.removeAllListeners();
        } else {
            socket.join(roomId)
        }
    })

    socket.on('fetchGridRequest', (roomId) => {
        socket.to(roomId).emit('fetchGrid',socket.id);            
    })

    socket.on('disconnect', () => {
    });
});


app.use('/api/grid',gridRoutes);


app.use((req,res,next) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
})



app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }
    res.status(err.code || 500);
    res.json({message:err.message || 'An unknown error occured'})
})


mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.knvy7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => server.listen(process.env.PORT || 5000))
    .catch(() => console.log('Could not connect to database'))