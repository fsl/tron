var context;
var spielfeldbreite = 50;
var spielfeldhoehe = 50;
var spieler1;
var spieler2;
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

function kreis(x, y, radius, farbe, context) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = farbe;
  context.fill();
}

function rechteck(x, y, breite, hoehe, farbe, context) {
  context.beginPath();
  context.rect(x, y, breite, hoehe);
  context.fillStyle = farbe;
  context.fill();
}

function zeichneFeld(spielfeld, spielers, context) {
  for (var x = 0; x<spielfeld.length; x++) {
    for (var y = 0; y<spielfeld[x].length; y++) {
      kreis(x*raster, y*raster, 1, 'white', context); 
    }
  }

  spielers.forEach(function (spieler) {
    rechteck(
      raster * (spieler.x-1/2),
      raster * (spieler.y-1/2), 
      raster, 
      raster, 
      spieler.farbe, 
      context
    );
  });
}

function erstelleSpieler(breite, hoehe)
{
  return [
  {
    x: 10,
    y: hoehe/2,
    richtung: 3,
    farbe: 'blue'
  }, {
    x: breite-10,
    y: hoehe/2,
    richtung: 9,
    farbe: 'purple'
  }
  ]
}

window.onload = function(){
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  context.font = "normal 40px Courier New";
  var spielfeld = erstelleSpielfeld(spielfeldbreite, spielfeldhoehe);
  var spieler = erstelleSpieler(spielfeldbreite, spielfeldhoehe);
  zeichneFeld(spielfeld, spieler, context);

};

