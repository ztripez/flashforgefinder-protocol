const net = require('net');
const FlashForgeFinder = require('./FlashForgeFinder');
const Forge = new FlashForgeFinder("10.0.0.193",8899);

Forge.on("login",() => {
});

Forge.on("data",(data) => {
	//console.log(data);
});

Forge.connect();
