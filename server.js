var express = require('express');
var admin = require('firebase-admin');
var bodyParser = require('body-parser');
var app = express();

var serviceAccount = require('./apprest-8fc3d-firebase-adminsdk-q5o34-e229cb387d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apprest-8fc3d-default-rtdb.firebaseio.com"
});

// Configura body-parser para manejar datos JSON
app.use(bodyParser.json());

// Fetch instances
app.get('/', function (req, res) {
  console.log("HTTP GET Request");
  var userReference = admin.database().ref("/Users/");

  // Attach an asynchronous callback to read the data
  userReference.on("value", 
    function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
      userReference.off("value");
    }, 
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      res.send("The read failed: " + errorObject.code);
    });
});

// Create new instance
app.put('/', function (req, res) {
  console.log("HTTP PUT Request");

  var userName = req.body.UserName;
  var name = req.body.Name;
  var age = req.body.Age;

  var referencePath = '/Users/' + userName + '/';
  var userReference = admin.database().ref(referencePath);
  userReference.set({ Name: name, Age: age }, 
    function(error) {
      if (error) {
        res.send("Data could not be saved." + error);
      } else {
        res.send("Data saved successfully.");
      }
  });
});

// Update existing instance
app.post('/', function (req, res) {
  console.log("HTTP POST Request");

  var userName = req.body.UserName;
  var name = req.body.Name;
  var age = req.body.Age;

  var referencePath = '/Users/' + userName + '/';
  var userReference = admin.database().ref(referencePath);
  userReference.update({ Name: name, Age: age }, 
    function(error) {
      if (error) {
        res.send("Data could not be updated." + error);
      } else {
        res.send("Data updated successfully.");
      }
  });
});

// Delete an instance
app.delete('/', function (req, res) {
  console.log("HTTP DELETE Request");
  // Todo: implementar la lógica de eliminación aquí si es necesario
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log("Example app listening at http://%s:%s", host, port);
});
