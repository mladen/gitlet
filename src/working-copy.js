var fs = require("fs");
var nodePath = require("path");
var index = require("./index");
var files = require("./files");
var objects = require("./objects");
var refs = require("./refs");
var diff = require("./diff");
var util = require("./util");

var workingCopy = module.exports = {
  writeCheckout: function(fromHash, toHash) {
    var dif = diff.diffTocs(objects.readCommitToc(fromHash), objects.readCommitToc(toHash));
    Object.keys(dif).forEach(function(p) {
      if (dif[p].status === diff.FILE_STATUS.ADD ||
          dif[p].status === diff.FILE_STATUS.MODIFY) {
        files.write(nodePath.join(files.repoDir(), p), objects.read(dif[p].giver));
      } else if (dif[p].status === diff.FILE_STATUS.DELETE) {
        fs.unlinkSync(p);
      }
    });

    workingCopy.rmEmptyDirs();
  },

  rmEmptyDirs: function() {
    fs.readdirSync(files.repoDir())
      .filter(function(n) { return n !== ".gitlet"; })
      .forEach(files.rmEmptyDirs);
  }
};