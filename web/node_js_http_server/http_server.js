var portNumber = 8000;

////////////////////////////////////////////////////////////////////////////////////////////////////////

var DEBUG_LOG = false;

var connect = require('connect');
var server = connect.createServer(connect.static(__dirname)).listen(portNumber);
var io = require('socket.io').listen(server);

io.set('log level', 1); 

io.sockets.on('connection', function (client) {

   if (DEBUG_LOG) {connectCounter++; console.log('client connected ('+ client.id +'), total clients: ' + connectCounter);}
    
    client.on('onSelectUpdate', function (data) {
        if (DEBUG_LOG) {console.log(client.id+' --> '); console.log(data);}
        io.sockets.emit('onSelectUpdate', data);
    });
    
    client.on('disconnect', function () {
        if (DEBUG_LOG) {connectCounter--; console.log('client disconnected, total clients: ' + connectCounter);}
    });
});

