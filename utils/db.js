const mongoose = require("mongoose");
const countrySchema = require("../schemas/country");

let _db = null;

/**
 * Singleton instance of db connection
 */
const getDB = function () {
  if (_db === null) {
    _db = mongoose.createConnection(process.env.MONGODB_URI, {
      maxPoolSize: 10
    });
  }

  _db.model("Country", countrySchema);

  return _db;
};

/**
 * Wait for connections to close before closing
 * the server
 */
const closeDB = function () {
  return new Promise(function (resolve, reject) {
    if (_db === null) {
      reject("Database connection does not exist!");
    } else {
      _db.close(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    }
  });
};

module.exports = {
  getDB: getDB,
  closeDB: closeDB
};
