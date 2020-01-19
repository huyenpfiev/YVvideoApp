var mongoose = require('mongoose');
var uuidv4 = require("uuid/v4");
var dbURI = 'mongodb://localhost/MyPlayVimeoHistoryDB';

mongoose.connect(dbURI, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log('Mongoose connected to : ' + dbURI); 
  }
});

var vimeoHistorySchema = new mongoose.Schema({
  _id: String,
  userEmail: String,
  searchText: String,
  date: Date
});

var vimeoHistoryModel = mongoose.model('VimeoHistory', vimeoHistorySchema);

module.exports = {
    addToHistory: function (user, searchText, cb) {
        var newVimeoHistory = new vimeoHistoryModel({
            _id: uuidv4(),
            userEmail: user.email,
            searchText: searchText,
            date: new Date()
        });
        newVimeoHistory.save(function (err) {
            if (err) {
                throw err;
            }
            cb();
        });
    },
    getHistorySet: function (user, cb) {
        vimeoHistoryModel.find({ userEmail: user.email }, function (err, historySet) {
            cb(historySet);
        });
    }

  }