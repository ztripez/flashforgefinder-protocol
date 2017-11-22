const net = require('net');
const FF = require('./FlashForgeFinder');

const client = new net.Socket();

const clientIp = "10.0.0.193";
const clientPort = "8899";



client.connect(clientPort, clientIp, () => {
	console.log('Connected');
  client.write("~M601 S1\n");
});

let one = 0;

client.on('data', (data) => {
  console.log(FF.packetParser(data));

});

client.on('close', () => {
	console.log('Connection closed');
});
client.on('error', () => {
	console.log('Connection error');
  client.destroy();
});
