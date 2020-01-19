var mongoose = require('mongoose');
var uuidv4 = require("uuid/v4");
var dbURI = 'mongodb://localhost/MyPlayYoutubeHistoryDB';

mongoose.connect(dbURI, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log('Mongoose connected to : ' + dbURI); 
  }
});

var youtubeHistorySchema = new mongoose.Schema({
  _id: String,
  userEmail: String,
  searchText: String,
  date: Date
});

var youtubeHistoryModel = mongoose.model('YoutubeHistory', youtubeHistorySchema);

module.exports = {
    addToHistory: function (user, searchText, cb) {
        var newYoutubeHistory = new youtubeHistoryModel({
            _id: uuidv4(),
            userEmail: user.email,
            searchText: searchText,
            date: new Date()
        });
        newYoutubeHistory.save(function (err) {
            if (err) {
                throw err;
            }
            cb();
        });
    },
    getHistorySet: function (user, cb) {
        youtubeHistoryModel.find({ userEmail: user.email }, function (err, historySet) {
            cb(historySet);
        });
    }

  }