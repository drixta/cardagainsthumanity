var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var allCard= JSON.parse(fs.readFileSync('cards.json','utf8'));

router.use(function(){
  console.log('Calling an api');
  next();
});

router.route('/cards')
  .get(function(req, res){
    res.json(allCard);
  });

app.use('/api', router);
app.listen(process.env.PORT || 3000, function(){  //CONFIG.port
	console.log("Server running on port " + 3000);
});
