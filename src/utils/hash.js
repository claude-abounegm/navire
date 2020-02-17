"use strict";

const _ = require("lodash");

function generateId(type, path) {
  let id = `${type}-${path}`;

  id = id.toLowerCase().replace(/[\s\.]+/g, "-");

  return id;
}

// function generateTimeBasedHash(hashLength = 6) {
//   if (!_.isNumber(hashLength)) {
//     throw new Error("hashLength needs to be a number greater than zero");
//   }

//   const { length } = _.reverse(String(Date.now()));
//   hashLength = _.clamp(hashLength, 1, length);

//   return dateStr.slice(0, hashLength);
// }

module.exports = { generateId /*, generateTimeBasedHash*/ };
