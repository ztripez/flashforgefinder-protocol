const net = require('net');
const client = new net.Socket();

const clientIp = "10.0.0.193";
const clientPort = "8899";


client.connect(clientPort, clientIp, () => {
	console.log('Connected');
  client.write("~M601 S1\n");
	//client.write('Hello, server! Love, Client.');
});

client.on('data', (data) => {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', () => {
	console.log('Connection closed');
});
client.on('error', () => {
	console.log('Connection error');
  client.destroy();
});
