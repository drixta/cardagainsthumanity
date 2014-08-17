var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

var allCard= JSON.parse(fs.readFileSync('cards.json','utf8'));

router.use(function(){
  console.log('Calling an api');
  next();
});

router.route('/cards')
  .get(function(req, res){
    res.json(allCard);
  });
var rooms = {};

io.on('connection', function(socket){
  var addedUser = false,
      roomOccupied;
  console.log('Socket is created');
  socket.on('join room', function (roomNumber) {
    if (roomNumber.hasOwnProperty('roomNumber')){
      socket.join(roomNumber);
      rooms[roomNumber][usernames][socket.username] = socket.username;
      ++rooms[roomNumber].numUsers;
      roomOccupied = roomNumber;
      console.log(socket.username + ' joined Room:' + roomNumber);
    }
    else {
      socket.join(roomNumber);
      rooms[roomNumber] = {
        usernames: {},
        numUsers: 1
      };
      rooms[roomNumber].usernames[socket.username] = socket.username;
      roomOccupied = roomNumber;
      console.log(socket.username + ' created room:' + roomNumber);     
    }
    io.in(roomNumber).emit('join room', {
        username: socket.username,
        numUsers: rooms[roomNumber].numUsers
    });
  });

  socket.on('disconnect', function(){
    var room;
    if (roomOccupied) {
      room = rooms[roomOccupied];
      if (addedUser){
        delete room.usernames[socket.username];
        --room.numUsers;
        socket.leave(roomOccupied);
      }
      io.in(roomOccupied).emit('user left',{
        username: socket.username,
        numUsers: room.numUsers
      });
      room.numUsers === 0 && (delete room);
      console.log(socket.username + ' left room: ' + roomOccupied);
    }
  });

  socket.on('create user', function (username) {
    socket.username = username;
    addedUser = true;
    console.log(socket.username + ' is created');
  });
});
app.use('/api', router);

http.listen(process.env.PORT || 3000, function(){  //CONFIG.port
  console.log("Server running on port " + 3000);
});
