var express = require('express');
var MessageStore = require('./messages-store')
var bodyParser = require('body-parser');


// create the app
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist'));

var connections = [];
var notifiy = (message) => {
	console.log("Sending message to open connections", message); 
	connections.forEach( conn => conn.write('data:' + JSON.stringify(message) +   '\n\n'));
};

app.get('/api/chat/messages', (req, res) => {
	MessageStore
		.getAll()
		.then(messages => res.status(200).send(messages));
});

app.post('/api/chat/messages', (req, res) => {
	console.log("Saving message", req.body);
	MessageStore
		.save(req.body)
		.then(msg => {
			res.status(201).send(msg)
		});
});

MessageStore.addMessageListener( msg => {
	notifiy(msg);
});


app.get('/api/chat/messages/stream', (req, res) => {
    req.socket.setTimeout(Number.MAX_VALUE);
	res.writeHead(200, {
        'Content-Type': 'text/event-stream;charset=UTF-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
	
	connections.push(res);
	
	req.on("close", function() {
		var index = connections.indexOf(res);
		if (index) {
			connections.splice(index,1);
		}
    });
});



var server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

