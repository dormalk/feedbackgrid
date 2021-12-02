const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gridRoutes = require('./routes/grid-routes');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const app = express();
const {Users} = require('./models/users.js');
var users = new Users();


app.use(bodyParser.json());

app.use(express.static(path.join('public')));


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

const server = http.createServer(app);
const io = socketIo(server,{ cors: {origin: '*'} });
io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (params) => {
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.room);

        const usersList = users.getUserList(params.room);
        io.to(params.room).emit('usersCount', usersList.length);
    })

    socket.on('updateRequest', () => {
        var user = users.getUser(socket.id);
        if(user){
            socket.broadcast.to(user.room).emit('updateTable');
        }
    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user){
            const usersList = users.getUserList(user.room);
            io.to(user.room).emit('usersCount', usersList.length);
        }
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
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.knvy7.mongodb.net/${process.env.DB_NAME_DEV}?retryWrites=true&w=majority`)
    .then(() => server.listen(process.env.PORT || 5000))
    .catch((err) => console.log(err))