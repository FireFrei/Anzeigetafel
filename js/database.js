//  Declare SQL Query for SQLite

var createStatement = "CREATE TABLE IF NOT EXISTS Lieder (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)";
var selectAllStatement = "SELECT * FROM Lieder";
var insertStatement = "INSERT INTO Lieder (text) VALUES (?)";
var updateStatement = "UPDATE Lieder SET text=? WHERE id=?";
var deleteStatement = "DELETE FROM Lieder WHERE id=?";
var dropStatement = "DROP TABLE Lieder";
var db = openDatabase("Lieder", "1.0", "Lieder", 200000);  // Open SQLite Database
var dataset;
var DataType;

function initDatabase() {
// Function Call When Page is ready.
try {
    if (!window.openDatabase) {
        // Check browser is supported SQLite or not.
        alert('Databases are not supported in this browser.');
    }

    else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    }

    catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            console.log("Invalid database version.");
        } 
        else {
            console.log("Unknown error " + e + ".");
        }

        return;
    }
}

function createTable() {
// Function for Create Table in SQLite.
db.transaction(function (tx) { tx.executeSql(createStatement, [], function(){}, onError); });
}

function insertRecord(value) {
// Get value from Input and insert record . Function Call when Save/Submit Button Click..
db.transaction(function (tx) { tx.executeSql(insertStatement, [value], success, onError); });
        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
    }

    function success() {
    //alert("Daten erfolgreich gespeichert!");
    //fsStatus = document.getElementById('fsstatus')
    var fsStatus = $('#fsstatus');
    fsStatus.empty();
    fsStatus.append('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"> </span> <b>Daten erfolgreich gespeichert!</b>');
    fsStatus.removeClass('alert-warning');
    fsStatus.addClass('alert-success');
}

function dropTable() {
// Function Call when Drop Button Click.. Talbe will be dropped from database.
db.transaction(function (tx) { tx.executeSql(dropStatement, [], function(){}, onError); });
initDatabase();
}

function loadRecord(i) {
// Function for display records which are retrived from database.
var item = dataset.item(i);

$("#text").val((item['text']).toString());
$("#id").val((item['id']).toString());
}

function onError(tx, error) {
// Function for Hendeling Error...
alert(error.message);
}

function showRecords() {
// Function For Retrive data from Database and Display records

db.transaction(function (tx) {
    tx.executeSql(selectAllStatement, [], function (tx, result) {
        dataset = result.rows;

        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);
            if (i==0) {
                $('#field1')[0].value = item['text'];
            }
            else {
                
                addItem([], item['text'], true);
            }
        }
    });
});
}

function saveData() {
    // Tabelle löschen
    dropTable();

    // save values
    for(i=0; i<countLied; i++) {
       insertRecord(document.getElementsByClassName("lied-item")[i].value);
   }

    // on success
    setTimeout(displayEditMode, 5000);
}
