// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var path = require('path');
var hbs = require('hbs');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',hbs.__express);
app.set('view engine', 'html');

app.get('/a', function(req, res) {
    res.render('index', { title: 'H5PPT' });
});

app.get('/m_index', function(req, res) {
    res.render('m_index', { title: 'H5PPT' });
});
app.get('/m_ppt', function(req, res) {
    res.render('m_ppt', { title: 'H5PPT' });
});

app.get('ppt', function(req, res) {
    res.render('ppt', { title: 'H5PPT' });
});

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var totalClicks = 0;
var threadHold = 100;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
    socket.emit('get click', {
        username: socket.username,
        totalClicks: totalClicks,
        emitRocket : totalClicks > threadHold
    });

    socket.on('set click', function (clicks) {
        totalClicks  =  clicks;
        socket.broadcast.emit('user click', {
            username: socket.username,
            totalClicks: totalClicks,
            emitRocket : totalClicks > threadHold
        });
    });

    socket.on('page', function (cmd) {
	
        socket.broadcast.emit('slide control', {
            cmd: cmd
        });
	
	console.log(cmd);
	
    });

    socket.on('fullscreen', function (data) {
        socket.broadcast.emit('fullscreen',data);
    });

    socket.on('closefullscreen', function (data) {
        socket.broadcast.emit('closefullscreen',data);
    });

    socket.on('toppt', function (data) {
        socket.broadcast.emit('toppt',data);
    });
    socket.on('showQr', function (data) {
        socket.broadcast.emit('showQr',data);
    });
    socket.on('hideQr', function (data) {
        socket.broadcast.emit('hideQr',data);
    });
    
    socket.on('send', function (username) {

        console.log('user',username,'click');

        ++totalClicks;

        console.log('total clicks',totalClicks);

        socket.emit('user click', {
            username: socket.username,
            totalClicks: totalClicks,
            emitRocket : totalClicks > threadHold
        });

        socket.broadcast.emit('user click', {
            username: socket.username,
            totalClicks: totalClicks,
            emitRocket : totalClicks > threadHold
        });

    });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
      console.log('user',username,'joied');
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
