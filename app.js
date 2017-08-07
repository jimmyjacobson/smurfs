const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
var ObjectId = require('mongoose').Types.ObjectId;

var SmurfModel = require('./models/smurfs');

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function(req, res, next){
    SmurfModel.SmurfModel.find()
      .then(function(searchResults) {
        res.render('index', {
          smurfs: searchResults,
          appType: "All the Smurfs"
        })
      })
      .catch(function(error) {
        res.render('index', {
          appType: "Error"
        })
      })
})

app.post("/smurf", function(req, res, next) {

  var data = {
    name: req.body.name,
    color: req.body.color,
    pictureUrl: req.body.pictureUrl
  };

  var smurf = new SmurfModel(data);

  smurf.save()
    .then(function() {
      res.render('smurf', smurf)
    })
    .catch(function(error) {
      res.redirect('/');
    })
})


//1. New GET Route to render edit form with information from the Request
//2. New Mustache Template to display edit form populated with specific smurf information
//3. New POST Route to take edit form submission and save smurf changes to the database

app.get('/edit/smurf/:id', function(req, res) {

  //Get id from request so I can find that rascaly smurf
  var id = req.params.id;

  //prepare query with id from request
  var query = {"_id": id};

  //perform query and render response with smurf database data smurf
  SmurfModel.SmurfModel.findOne(query)
    .then(function(param1) {
      res.render('editSmurf', param1);
    })
    .catch(function(error) {
      //todo: add error state
    })
});

app.post('/submit/smurf', function(req, res) {

  //1. Get the data from the request body (aka the form) and store it in a object
  var data = {};
  data._id = req.body._id;
  data.name = req.body.name;
  data.color = req.body.color;
  data.pictureUrl = req.body.pictureUrl;

  //2. I want to update the smurf in the database with my new data
  var query = {"_id": data._id};

  SmurfModel.smurfModel.findOne(query)
    .then(function(smurf) {
      smurf.name = data.name;
      smurf.color = data.color;
      smurf.pictureUrl = data.pictureUrl;

      smurf.save()
        .then(function(savedSmurf) {
          //3. I want to send my user back to the index page
          res.redirect('/');
        })
    });   
});

app.listen(3000, function(){
  console.log("App running on port 3000")
})