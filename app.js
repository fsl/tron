var context;
var spielfeldbreite = 100;
var spielfeldhoehe = 100;
var raster = 10;

function erstelleSpielfeld(breite, hoehe) {
  var spielfeld = [];
  for(var x = 0; x<breite; x++) {
    spielfeld[x] = [];
    for(var y = 0; y<hoehe; y++) {
      spielfeld[x][y] = 0;     
    }
  }
  return spielfeld;
}

function kreis(x, y, radius, farbe) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = farbe;
  context.fill();
}

function zeichneFeld(spielfeld, context) {
  for(var x = 0; x<spielfeld.length; x++) {
    for(var y = 0; y<spielfeld[x].length; y++) {
      kreis(x*raster, y*raster, 1, 'red'); 
    }
  }
}

window.onload = function(){
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  context.font = "normal 40px Courier New";
  var spielfeld = erstelleSpielfeld(spielfeldbreite, spielfeldhoehe);
  zeichneFeld(spielfeld, context);
};

