var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

var allCard= JSON.parse(fs.readFileSync('cards.json','utf8'));
var ACard = allCard.filter(function(elem){
  return elem.cardType === 'A';
});
var QCard = allCard.filter(function(elem){
  return elem.cardType === 'Q';
});
var shuffle = function(deck){
  var m = deck.length,
      temp,
      i;
  while(m) {
    i = Math.floor(Math.random() * m--);
    t = deck[m];
    deck[m] = deck[i];
    deck[i] = t;
  }
  return deck;
};

var getNAmountOfCards = function(n, type, nextSet){
  var i,
      deck = [];
  if (typeof nextSet === 'undefined') {
    nextSet = 0;
  }
  switch (type) {
    case 'A':
      return shuffle(ACard.slice(nextSet * n, n));
    case 'Q':
      return shuffle(QCard.slice(nextSet * n, n));
    default:
      throw new Error('There are no such ' + type + ' of cards');
  }
};

router.use(function(req,res,next){
  console.log(req.url);
  next();
});

router.route('/cards')
  .get(function(req, res){
    res.json(allCard);
  });

router.route('/getwhitecards/:set')
  .get(function(req,res){
    res.json(getNAmountOfCards(300, 'A', req.params.set));
  });
var rooms = {};

io.on('connection', function(socket){
  var addedUser = false,
      roomOccupied;
  console.log('Socket is created');
  socket.on('join room', function (roomNumber) {
    if (rooms.hasOwnProperty(roomNumber)){
      socket.join(roomNumber);
      rooms[roomNumber].usernames[socket.username] = socket.username;
      ++rooms[roomNumber].numUsers;
      roomOccupied = roomNumber;
      console.log(socket.username + ' joined Room:' + roomNumber);
    }
    else {
      socket.join(roomNumber);
      rooms[roomNumber] = {
        usernames: {},
        numUsers: 1,
        ADeck: getNAmountOfCards(500, 'A'),
        QDeck: getNAmountOfCards(50, 'Q')
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

  socket.on('requestRoomData', function(){
    socket.emit('responseRoomData', {
      usernames: rooms[roomOccupied].usernames,
      numUsers: rooms[roomOccupied].numUsers,
      ADeck: rooms[roomOccupied].ADeck.splice(0,10),
      FullADeck: rooms[roomOccupied].ADeck
    });
  });

  socket.on('requestInitialCards', function(){
    socket.emit('responseInitialCards', {
      ACards: rooms[roomOccupied].ADeck.splice(0,10)
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
      console.log(socket.username + ' left room: ' + roomOccupied);
      if (room.numUsers === 0) {
        console.log(roomOccupied + ' is empty, removing room');
        delete room;
      }
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
