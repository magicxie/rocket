/*var http = require('http'); 
 http.createServer(function (req, res) {
 res.writeHead(200, {'Content-Type': 'text/html'});
 // var fs = require('fs');
 //var file = fs.readFileSync('e:\aaa.html', "utf8");
 res.end('hello');
 }).listen(8080, "127.0.0.1"); */



var fs = require('fs')
	, http = require('http')
	, socketio = require('./node_modules/socket.io');

var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	// res.end(fs.readFileSync(__dirname + '/index.html'));
	res.end('hello');
}).listen(3001, function() {

});


var list=[],
	len;

isConnection=0;
socketio.listen(server).on('connection', function (socket) {

	socket.on('usermsg', function (msg) {
		socket.xy=msg;
		socket.friend && socket.friend.emit('serverMsg', msg);
	});

	socket.on('die', function (msg) {
		//console.log('111111111111111111Message Received: ', msg);

		if(socket.friend){
			socket.friend.emit('serverdie', msg);
			socket.friend.friend=null;

			list.push(socket.friend);
			socket.friend=null;
		}else{
			len=list.length;
			for(;len--;){
				if(list[len]==socket){
					list.splice(len,1);
					break;
				}
			}
		}

	});


	socket.on('join', function (msg) {
		socket.joinName=msg;
		if(list.length<1){
			list.push(socket);
		}else{
			var f=list.shift();
			socket.friend=f;
			socket.friend.emit('addfriend',{joinName:msg});
			if(socket.friend.xy){
				socket.friend.xy.joinName=socket.friend.joinName;
				socket.friend.xy.join=1;
			}else{
				socket.friend.xy = {joinName:socket.friend.joinName,join:1};
			}
			socket.emit('addfriend',socket.friend.xy);
			f.friend=socket;
		}
	});

	socket.on('disconnect', function() {
		if(socket.friend){
			socket.friend.emit('out');
			socket.friend.friend=null;
			list.push(socket.friend);
			socket.friend=null;
		}else{
			len=list.length;
			for(;len--;){
				if(list[len]==socket){
					list.splice(len,1);
					break;
				}
			}
		}
		console.log(list.length);
	});

	if(isConnection){return;}

	isConnection=1;

	var dijiT=1000*60/20,
		oldT=new Date().getTime(),
		jiange=0,
		Ntime;



	//console.log(jiange);
	var ggg=0;
	setInterval(function(){
		//console.log(new Date().getTime());
		Ntime=new Date().getTime();
		jiange+=Ntime-oldT;

		if(jiange>dijiT-1){

			socket.broadcast.emit('addDiji',{time:Ntime,x:Math.floor(Math.random()*430)});
			socket.emit('addDiji',{time:Ntime,x:Math.floor(Math.random()*430)});
			jiange-=dijiT;
		}
		oldT=Ntime;
	},1000);
});
