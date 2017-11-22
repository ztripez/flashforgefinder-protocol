
const net = require('net');
const EventEmitter = require('events');

class FlashForgeFinder extends EventEmitter{

  constructor(clientIp,clientPort,sendTime=10){
    super();
    this.clientIp = clientIp;
    this.clientPort = clientPort;
    this._client = new net.Socket();
    this._client.on('data',(data)=> this.onData(data));
    this._client.on('close',() => this.onClose);
    this._client.on('error',(err) => this.onError(err));
    this._heartbeatId = 0;
    this._fifoBuffer = [];
    this.sendTime = sendTime;
  }
  connect(){
    this._client.connect(this.clientPort, this.clientIp, () => {
      this.send("~M601 S1");
      this._heartbeatId = setInterval(() => {this.heartbeat();}, 5*1000);
      this.fifoId = setInterval(() => {this.fifoSend();}, this.sendTime);
    });
  }

  logout(){
    clearInterval(this._heartbeatId);
    clearInterval(this.fifoId);
    this._client.write("~M602");
    this._client.disconnect();
  }

  onData(data) {

    const pkg = packetParser(data);
    console.log(pkg);
    switch (pkg.code) {
      case "M601":
        if(pkg.ok) {
          this.emit('login');
        }
        break;
      default:
    }
  }
  onError(err) {
    this.emit("error",err);
  }
  onClose() {
    this.emit("close");
  }

  heartbeat() {
    this.send("~M27");
  }

  send(command){
    console.log("c",command);
    this._fifoBuffer.push(command+"\n");
  }

  _rgbToLed(color){
    color = color.toUpperCase();
    if(color.startsWith("#")) color=color.slice(1, color.length);
    return "r"+parseInt(color.slice(0, 2),16)+" g"+parseInt(color.slice(2, 4),16)+" b" +parseInt(color.slice(4, 6),16) + " F0";
  }

  setLedColor(rgb){
    this.send("~M146 " + this._rgbToLed(rgb));
  }

  fifoSend(){
    if(this._fifoBuffer.length > 0)
    {
      const command = this._fifoBuffer.shift();
      console.log("Sending: " + command);
      this._client.write(command);
    }

  }

}


function messageExtractor(lines){
  return lines.reduce((acc,elm) => {
    if(elm.indexOf("CMD ")!== -1 || (elm === "ok") || (elm === "") ) return acc;
    if(elm === "ok\n") elm = "ok";
    return acc+elm +"\n";
  },"").replace("\n","");

}


function packetParser(data) {

  const dataStr = data.toString();
  /* test packet
  CMD M602 Received.
Control Release.
ok
*/
  const lines = dataStr.split("\r\n");
  console.log(lines);
  const cmds = lines[0].split(" ");
  message = messageExtractor(lines);
  return {
    code: cmds[1],
    message,
    ok: lines[lines.length-2].replace("\n","") == "ok" || message == "ok"
  }
}



module.exports.FlashForgeFinder = FlashForgeFinder;
module.exports.packetParser = packetParser;
