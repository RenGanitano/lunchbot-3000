// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");

// //instructions for these changes here;
// //https://github.com/wesbos/scrapecity/issues/2#issue-422894054
// const adapter = new FileSync("db.json");
// exports.initDB = async () => {
//   const db = await low(adapter);
//   db.defaults({}).write();
//   return db;
// };

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

exports.adapter = new FileSync("db.json");
exports.db = low(exports.adapter);
exports.db.defaults({}).write();
