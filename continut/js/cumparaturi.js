

class Produs {
    constructor(id, nume, cantitate) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = id;
    }
}

class ProdusLocalStorage extends Produs {
    constructor(id, nume, cantitate) {
        super(id, nume, cantitate);
    }

    afisare() {
        console.log(`Produs: ${this.nume}, Cantitate: ${this.cantitate}`);
    }
}

class ProdusIndexedDB extends Produs {
    constructor(id, nume, cantitate) {
        super(id, nume, cantitate);
    }

    afisare() {
        console.log(`Produs: ${this.nume}, Cantitate: ${this.cantitate}`);
    }

    toJSON() {
        return {
            id: this.id,
            nume: this.nume,
            cantitate: this.cantitate
        };
    }
}


function notificareWebWorker() {
    console.log('Trimit notificare către Web Worker!');
    worker.postMessage('Mesaj de la scriptul principal: A fost apăsat butonul');
}

//setare un camp vid care e json 
var produse = []
localStorage.setItem("produse", JSON.stringify(produse));

function cumpara() { //functie pt adaugarea numelui si a cantitatii in localStorage sau DBStorage
    
    //creare worker
    let optiuneSelectata;
    worker = new Worker('js/worker.js');

    
    const optiuni = document.getElementsByName('optiune');

    for (let i = 0; i < optiuni.length; i++) {
        if (optiuni[i].checked) {
            optiuneSelectata = optiuni[i].value;
            break;
        }
    }

    let nume = document.getElementById("nume").value;
    let cantitate = document.getElementById("cantitate").value;


    if (optiuneSelectata == "LocalStorage") {
        //prelucrare date

        var produse_stocate = JSON.parse(localStorage.getItem("produse"));

        // Adăugăm un produs nou 
        produse_stocate.push(new ProdusLocalStorage(produse_stocate.length + 1, nume, cantitate));

        // Stocăm noul array în localStorage, înlocuind vechiul array de produse
        localStorage.setItem("produse", JSON.stringify(produse_stocate));

        //atasare ascultator de evenimente
        worker.onmessage = event => {
            afisareProduseLocale();
        };
    }

    else if (optiuneSelectata == "DataBase") {

        //deschiderea bazei de date
        let request = indexedDB.open("produseDB", 2);

        request.onerror = function (event) {
            console.log("Nu s-a putut deschide baza de date");
        };

        //daca baza de date nu exista
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            console.log("Creez produseStore ")

            //crearea obiect de stocare
            let objectStore = db.createObjectStore("produseStore", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("nume", "nume", { unique: false });
            objectStore.createIndex("cantitate", "cantitate", { unique: false });
        };

        //daca baza de date exista
        request.onsuccess = function (event) {
            let db = event.target.result;

            // adaugarea datelor in obiectul de stocare
            if (!db.objectStoreNames.contains('produseStore')) {
                console.log("Creez produseStore ")

                //crearea obiectului de stocare
                let objectStore = db.createObjectStore("produseStore", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("nume", "nume", { unique: false });
                objectStore.createIndex("cantitate", "cantitate", { unique: false });
            }
            let transaction = db.transaction(["produseStore"], "readwrite");
            let objectStore = transaction.objectStore("produseStore");

            //numar de elemente
            let countRequest = objectStore.count();

            countRequest.onsuccess = function (event) {
                console.log("Baza de date conține " + event.target.result + " elemente");

                console.log("___Adaugare:" + JSON.stringify((new ProdusIndexedDB(event.target.result + 1, nume, cantitate)).toJSON()) + "___")
                let requestAdd = objectStore.add((new ProdusIndexedDB(event.target.result + 1, nume, cantitate)).toJSON());
                requestAdd.onsuccess = function (event) {
                    console.log("Produs adaugat cu succes in IndexedDB");
                };

                requestAdd.onerror = function (event) {
                    console.log("Nu s-a putut adauga produsul in IndexedDB" + event.target.error);
                };

                transaction.oncomplete = function (event) {
                    db.close();
                };
            };
        }

        afisareProduseDB();

    }


    //notificare worker
    notificareWebWorker();
}

function afisareProduseLocale() {
    console.log("***Afisare produse locale***");

    //prelucrare date actuale
    var produse_stocate = JSON.parse(localStorage.getItem("produse"));

    if (produse_stocate.length) {
        var list = "<tr><th>ID</th><th>Nume</th><th>Cantitate</th></tr>\n";
        var i;
        for (i of produse_stocate) {
            list += "<tr><td>" + i.id + "</td>\n<td>" +
                i.nume + "</td>\n<td>" + i.cantitate + "</td></tr>\n";
        }
        document.getElementById('LocalTable').innerHTML = list;
    }
    else {
        var list = "<tr><th>ID</th><th>Nume produs</th><th>Cantitate</th></tr>\n";
        document.getElementById('LocalTable').innerHTML = list;
    }
}

function afisareProduseDB() {
    console.log("****Afisare produse DB****")
    
    let request = indexedDB.open("produseDB", 2);

    request.onerror = function (event) {
        console.log("Nu s-a putut deschide baza de date");
    };

    request.onsuccess = function (event) {
        db = event.target.result;

        let table = document.getElementById("DataBaseTable");
        table.innerHTML =""

        let headerRow = table.insertRow(0);

        let idHeaderCell = headerRow.insertCell();
        let numeHeaderCell = headerRow.insertCell();
        let cantitateHeaderCell = headerRow.insertCell();

        idHeaderCell.innerText = "ID";
        numeHeaderCell.innerText = "Nume";
        cantitateHeaderCell.innerText = "Cantitate";

        let transaction = db.transaction("produseStore", "readonly");
        let objectStore = transaction.objectStore("produseStore");
        let cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let row = table.insertRow();
                let idCell = row.insertCell();
                let numeCell = row.insertCell();
                let cantitateCell = row.insertCell();
                idCell.innerText = cursor.value.id;
                numeCell.innerText = cursor.value.nume;
                cantitateCell.innerText = cursor.value.cantitate;

                cursor.continue();
            }
        };
    }

}