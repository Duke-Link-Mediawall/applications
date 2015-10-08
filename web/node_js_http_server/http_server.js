var portNumber = 8080;

////////////////////////////////////////////////////////////////////////////////////////////////////////

var connect = require('connect');
var server = connect.createServer(connect.static(__dirname)).listen(portNumber);
var io = require('socket.io').listen(server);

io.set('log level', 1); 

io.sockets.on('connection', function (client) {

   // connectCounter++;
   // console.log('client connected ('+ client.id +'), total clients: ' + connectCounter);
    
    client.on('onSelectUpdate', function (data) {
        //console.log(client.id+' -->'); console.log(data);
        io.sockets.emit('onSelectUpdate', data);
    });
    
    client.on('disconnect', function () {
        //connectCounter--;
        //console.log('client disconnected, total clients: ' + connectCounter);
    });
});

