var context;
var spielfeldbreite = 100;
var spielfeldhoehe = 60;
var raster = 10;
var lebendigeSpielerID = 0

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

function zeichneFeld(spielfeld, spielers, context, neuzeichnen) {
  for (var x = 1; x<spielfeld.length; x++) {
    for (var y = 1; y<spielfeld[x].length; y++) {
      var farbe = 'green'
      spielers.forEach(function (spieler) {
        if (spielfeld[x][y] == spieler.id) {
          farbe = spieler.spur;
        }
      })      
      if (spielfeld[x][y] > 0) {
        rechteck(
            raster * (x-1/2),
            raster * (y-1/2), 
            raster, 
            raster, 
            farbe,
            context
            );
      } else {
        if (neuzeichnen) {
          rechteck(
              raster * (x-1/2),
              raster * (y-1/2), 
              raster, 
              raster, 
              'black',
              context
              );
          kreis(x*raster, y*raster, 1, 'white', context); 
        }
      }
    }
  }

  spielers.forEach(function (spieler) {
    if (spieler.richtung > 0) {
      rechteck(
        raster * (spieler.x-1/2),
        raster * (spieler.y-1/2), 
        raster, 
        raster, 
        spieler.farbe, 
        context
        );
    }
  });
}

function reseteSpieler(spielers, breite, hoehe)
{
  var spielerZaehler = 0;
  var xPositionen = [10, breite - 10, breite /2, breite /2];
  var yPositionen = [hoehe / 2 , hoehe / 2, 10, hoehe - 10];
  var richtungen = [3, 9, 6, 12];

  spielers.forEach(function (spieler) {
    spieler.x = xPositionen[spielerZaehler];
    spieler.y = yPositionen[spielerZaehler];
    spieler.richtung = richtungen[spielerZaehler];
    console.log(spieler);
    spielerZaehler++;
  });
  return spielers;
}

function erstelleSpieler(breite, hoehe)
{
  return reseteSpieler([
  {
    id: 1,
    farbe: 'red',
    spur: 'maroon',
    punkte: 0
  }, {
    id: 2,
    farbe: 'yellow',
    spur: 'olive',
    punkte: 0
  }
  ], breite, hoehe);
}

function versetzeSpieler(spielers) {
  spielers.forEach(function (spieler) { 
    switch(spieler.richtung) {
      case 3:
        spieler.x++;
        break;
      case 6:
        spieler.y++;
        break;
      case 9:
        spieler.x--;
        break;
      case 12:
        spieler.y--;
    }
  });
}

function markiereFeld(spielfeld, spielers) {
  spielers.forEach(function (spieler) { 
    if (spieler.richtung > 0) {
      spielfeld[spieler.x][spieler.y] = spieler.id;
    }
  });
}

function kollisionWand(spielers, spielfeld) {
  spielers.forEach(function (spieler) {
    if (spieler.richtung > 0) {
      if (spieler.x <= 0 || spieler.x >= spielfeld.length
        || spieler.y <= 0 || spieler.y >= spielfeld[0].length) { 
          deaktiviereSpieler(spieler);
        } 
    }
  });
}

function kollisionSpur(spielers, spielfeld) {
  spielers.forEach(function (spieler) {
    if (spieler.richtung > 0) {
      if (spielfeld[spieler.x][spieler.y] > 0) { 
        deaktiviereSpieler(spieler);
      }
    } 
  });
}

function lebendigeSpieler(spielers) {
  var lebendigeSpieler = 0;
  spielers.forEach(function (spieler) {
    if (spieler.richtung > 0) {
      lebendigeSpieler++
      lebendigeSpielerID = spieler.id
    }
  });
  return lebendigeSpieler;
}

function deaktiviereSpieler(spieler) {
  spieler.x = -10;
  spieler.y = -10;
  spieler.richtung = 0;
}

function reseteSpiel(spielfeld, spieler) {
  for(var x = 0; x<spielfeld.length; x++) {
    for(var y = 0; y<spielfeld[x].length; y++) {
      spielfeld[x][y] = 0;     
    }
  }
  reseteSpieler(spieler, spielfeld.length, spielfeld[0].length);
  zeichneFeld(spielfeld, spieler, context, true);
}

function schritt(spielfeld, spieler, context) {
  markiereFeld(spielfeld, spieler);
  versetzeSpieler(spieler);
  kollisionWand(spieler, spielfeld);
  kollisionSpur(spieler, spielfeld);
  if (lebendigeSpieler(spieler) == 1) {
    reseteSpiel(spielfeld, spieler);
  }
  if (lebendigeSpieler(spieler) == 0) {
    reseteSpiel(spielfeld, spieler);
  }
  zeichneFeld(spielfeld, spieler, context);
  setTimeout(function() {
    schritt(spielfeld, spieler, context);
  }, 50)
}

function initBedienung(spieler) {
  document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.keyCode) {
      case 65: spieler[0].richtung = 9;  break;
      case 87: spieler[0].richtung = 12; break;
      case 68: spieler[0].richtung = 3;  break;
      case 83: spieler[0].richtung = 6;  break;
      case 37: spieler[1].richtung = 9;  break;
      case 38: spieler[1].richtung = 12; break;
      case 39: spieler[1].richtung = 3;  break;
      case 40: spieler[1].richtung = 6;  break;
    }
  }
}

window.onload = function(){
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  context.font = "normal 40px Courier New";
  var spielfeld = erstelleSpielfeld(spielfeldbreite, spielfeldhoehe);
  var spieler = erstelleSpieler(spielfeldbreite, spielfeldhoehe);
  zeichneFeld(spielfeld, spieler, context, true);
  schritt(spielfeld, spieler, context);
  initBedienung(spieler);
};
