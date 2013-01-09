var context;
var spielfeldbreite = 50;
var spielfeldhoehe = 50;
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

function zeichneFeld(spielfeld, spielers, context) {
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
        kreis(x*raster, y*raster, 1, 'white', context); 
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

function erstelleSpieler(breite, hoehe)
{
  return [
  {
    id: 1,
    x: 10,
    y: hoehe/2,
    richtung: 3,
    farbe: 'red',
    spur: 'maroon'
  }, {
    id: 2,
    x: breite-10,
    y: hoehe/2,
    richtung: 9,
    farbe: 'yellow',
    spur: 'olive'
  }
  ]
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
      if (spieler.x <= 0 || spieler.x >= spielfeld[0].length
        || spieler.y <= 0 || spieler.y >= spielfeld.length) { 
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

function schritt(spielfeld, spieler, context) {
  markiereFeld(spielfeld, spieler);
  versetzeSpieler(spieler);
  kollisionWand(spieler, spielfeld);
  kollisionSpur(spieler, spielfeld);
  if (lebendigeSpieler(spieler) == 1) {
    alert('Spieler ' + lebendigeSpielerID + ' hat gewonnen');
    location.reload()
  }
  if (lebendigeSpieler(spieler) == 0) {
    alert('Unentschieden');
    location.reload()
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
  schritt(spielfeld, spieler, context);
  initBedienung(spieler);
};
