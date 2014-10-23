/*jshint indent:2, laxcomma:true, laxbreak:true*/
var util = require('util')
, diff = require('..')
, data = require('./practice-data')
;

var cycle = -1
, i
, len = data.length
, prior = {}
, comparand
, records
, ch
;

var applyEachChange = function (ch) {
        diff.applyChange(prior, comparand, ch);
      };

while (++cycle < 10) {
  i = -1;
  while (++i < len) {

    comparand = data[i];

    // get the difference...
    records = diff(prior, comparand);

    // round-trip serialize to prune the underlying types...
    var serialized = JSON.stringify(records);
    var desierialized = JSON.parse(serialized);

    if (desierialized) {
      desierialized.forEach(applyEachChange);

      prior = comparand;
    }
  }
}
