function browser()
{
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    document.getElementById("date").innerHTML = "Data curenta: " + day +"/" + month + "/" +year;

    let hour = d.getHours();
    let minutes = d.getMinutes();
    document.getElementById("hour").innerHTML = "Ora curenta: " + hour + ":" + minutes;

    document.getElementById("url").innerHTML = "Adresa url:  " +window.location.href;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        document.getElementById("demo").innerHTML =
        "Geolocation is not supported by this browser.";
      }

      document.getElementById("bName").innerHTML = "Numele browser-ului:  " + navigator.appName;
      document.getElementById("bVersion").innerHTML = "Numele browser-ului:  " + navigator.appVersion;
      document.getElementById("SO").innerHTML = "Sistemul de operare folosit de utilizator:  " + navigator.platform;


    
      var canvas = document.getElementById("Canvas");
     

      // Obtinem contextul de desenare al canvas-ului

      var ctx = canvas.getContext("2d");
      let colorIn=document.getElementById('colorIn');
      let colorOut=document.getElementById('colorOut');

      ctx.strokeStyle = "#FF0000";
      // Variabila pentru a memora punctul de start al desenarii unui dreptunghi

      var xp = 0;
      var yp = 0;

      // Adaugam un eveniment care sa deseneze dreptunghiul cand se apasa de doua ori pe butonul mouse-ului
      canvas.addEventListener("click", function(event) {

    // Obtinem pozitia cursorului de mouse in momentul evenimentului
    
    var rectBound= canvas.getBoundingClientRect();

    var x = event.clientX - rectBound.left;
    var y = event.clientY - rectBound.top;

    console.log(x);
    console.log(y);
  

    // Verificam daca startPoint nu are nicio valoare si salvam pozitia cursorului ca punctul de start
    if (!xp || !yp) {
      xp = x;
      yp = y;
    } else {

    // Desenam dreptunghiul folosind coordonatele punctului de start si cele ale punctului curent
    
    var width = x - xp;
    var height = y - yp;

  


    ctx.fillStyle=colorIn.value;
    ctx.fillRect(xp,yp, width, height);

    ctx.strokeStyle=colorOut.value;
    ctx.strokeRect(xp,yp, width, height);
  
    // Resetam punctul de start pentru a permite desenarea altor dreptunghiuri
    xp = 0;
    yp = 0;
  }

});

}

function inserareColoana() {
  var poz = document.getElementById("poz").value;
  var tbl = document.getElementById('tabel');
  var i;
  for (i = 0; i < tbl.rows.length; i++) {
      creareColoana(tbl.rows[i].insertCell(poz), 'A' + i);
  }
}



function inserareRand() {
  var poz = document.getElementById("poz").value;
  var tbl = document.getElementById('tabel');
  var row = tbl.insertRow(poz);
  for (i = 0; i < tbl.rows[0].cells.length; i++) {
      creareColoana(row.insertCell(i), 'A' + i);
  }
}

function creareColoana(cell, text) {
  var div = document.createElement('div');
  var txt = document.createTextNode(text);
  div.appendChild(txt);
  cell.appendChild(div);
}

function schimbaCuloare_coloana() {
  var poz = document.getElementById("poz").value;
  var x = document.getElementById("tabel").getElementsByTagName("td");
  x[poz].style.backgroundColor = document.getElementById("culoare").value;
}

function schimbaCuloare_linie() {
  var poz = document.getElementById("poz").value;
  var x = document.getElementById("tabel").getElementsByTagName("tr");
  x[poz].style.backgroundColor = document.getElementById("culoare").value;
}


function showPosition(position) {
    document.getElementById("location").innerHTML =
    "Latitude: " + position.coords.latitude + "<br>" + "<br>" +
    "Longitude: " + position.coords.longitude;
  }

  function schimbaContinut(resursa,jsFisier,jsFunctie){


  
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
      document.getElementById("continut").innerHTML=this.responseText;

      if (jsFisier) {
        var elementScript = document.createElement('script');
        elementScript.onload = function () {
        console.log("hello");
        if (jsFunctie) {
        window[jsFunctie]();
        }
        };
        elementScript.src = jsFisier;
        document.head.appendChild(elementScript);
        } else {
        if (jsFunctie) {
        window[jsFunctie]();
        }
      }

      if(resursa == "invat"){
        browser();
      }
    };
    
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
    
  }