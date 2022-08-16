var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");



//requiring  routes
var userRouter = require('./routes/user');
var driverRouter = require('./routes/driver');
var orderRouter = require('./routes/order');
var cityRouter = require('./routes/city');
var messageRouter = require('./routes/message');
var conversationRouter = require('./routes/conversation');
var uploadImageRouter = require('./routes/upload_img');

//----using modules middlewares
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use('/images', express.static('public/images'));

//Creating middleware to use my routes
app.use('/api/user', userRouter);
app.use('/api/driver', driverRouter);
app.use('/api/order', orderRouter);
app.use("/api/city", cityRouter);
app.use("/api/message", messageRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/uploadImage", uploadImageRouter);

////// socket io ////////

// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
//   console.log("users", users);
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   let user = users.find((user) => user.userId === userId);
//   return user;
// };

// io.on("connection", (socket) => {
//   console.log("a user connected.");
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   socket.on("sendMessage", ({ senderId, receiverId }) => {
//     const sender = getUser(senderId);
//     const receiver = getUser(receiverId);
//     console.log({ senderId, receiverId });
//     io.to(sender.socketId).emit("getMessages");
//     receiver && io.to(receiver.socketId).emit("getMessages");
//   });

//   socket.on("disconnect", () => {
//     console.log("a user disconnected!");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });

////////////////////////////////////////////////////////
//////////////// Connection to mongodb /////////////////
////////////////////////////////////////////////////////
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("connection is success");
  }).catch((error) => console.log(error));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;