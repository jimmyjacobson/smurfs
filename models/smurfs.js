const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = "mongodb://localhost:27017/smurfs";
mongoose.connect(url);

const smurfSchema = new mongoose.Schema({
  name: {type: String, minLength: 1, maxLength: 140},
  color: {type: String, enum: ["blue"], default: "blue"},
  pictureUrl: {type: String}
}); 

const SmurfModel = mongoose.model('smurfs', smurfSchema)

function getAllSmurfs(callback) {
  SmurfModel.findMany({})
    .then(function(smurfs) {
      callback(smurfs);
    })
    .catch(function(error) {
      console.log("error", error);
      callback(null);
    })
}

function createSmurf(data, callback) {

  var smurf = new SmurfModel(data);

  smurf.save()
    .then(function() {
      callback(smurf);
    })
    .catch(function(error) {
      console.log("Error saving smurf:", error);
      callback();
    })
}

module.exports = {
  getAllSmurfs: getAllSmurfs,
  createSmurf: createSmurf
}