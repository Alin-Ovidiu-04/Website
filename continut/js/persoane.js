function incarcaPersoane() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            createTable(this);
        }
    };
    xmlhttp.open("GET", "resurse/persoane.xml", true);
    xmlhttp.send();
}

function createTable(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table = "<table><tr><th>Nume</th><th>Prenume</th><th>Vârsta</th><th>Adresa</th><th>CV</th></tr>";
    var x = xmlDoc.getElementsByTagName("persoana");
    p1.innerHTML = "";
    

    for (i = 0; i < x.length; i++) {
        table += "<tr><td>" + x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
            "</td><td>" + x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
            "</td><td>" + x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue +
            "</td><td>" + "str. " + x[i].getElementsByTagName("adresa")[0].childNodes[0].nodeValue +
            ", nr. " + x[i].getElementsByTagName("numar")[0].childNodes[0].nodeValue +
            ", loc. " + x[i].getElementsByTagName("localitate")[0].childNodes[0].nodeValue +
            ", jud. " + x[i].getElementsByTagName("judet")[0].childNodes[0].nodeValue +
            "," + x[i].getElementsByTagName("tara")[0].childNodes[0].nodeValue +
            "</td><td>" + x[i].getElementsByTagName("cv")[0].childNodes[0].nodeValue +
            " liceu: " + x[i].getElementsByTagName("liceu")[0].childNodes[0].nodeValue +
            "; facultate: " + x[i].getElementsByTagName("facultate")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
    table += "</table>"
    document.getElementById("tabel").innerHTML = table;
}