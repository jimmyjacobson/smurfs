const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

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

  SmurfModel.createSmurf(data, function(smurf) {
    if (smurf) {
      var model = {
        appType: "Smurf Added",
        smurf: smurf
      }
      res.render("smurf", model);
    }
    else {
      res.redirect("/"); 
    }
  });
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})