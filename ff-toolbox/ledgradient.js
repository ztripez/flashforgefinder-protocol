const FlashForgeFinder = require("./FlashForgeFinder");
const tinygradient = require('tinygradient');
//const grad = tinygradient(['#ff0000', '#00ff00', '#e5005d']);
const grad = tinygradient({h: 0, s: 1, v: 1, a: 1},{h: 359, s: 1, v: 1, a: 1});
var forwardColors = grad.hsv(100).map(el => el.toHexString());
const backWardsColors = [...forwardColors].reverse()
const colors = [...forwardColors,...backWardsColors];

const Forge = new FlashForgeFinder.FlashForgeFinder("10.0.0.193",8899);

let faderInt = 0;
let fadeIndex = 0;

Forge.on("login",() => {
  //Forge.send("~M146 r0 g0 b0 F1");
  Forge.setLedColor("#000000");
  faderInt = setInterval(() => {
    if(fadeIndex == colors.length-1) fadeIndex = 0;
    Forge.setLedColor(colors[fadeIndex]);
    fadeIndex++;
  },100);
});

Forge.on("data",(data) => {
  console.log(data.toString());
});

Forge.connect();
