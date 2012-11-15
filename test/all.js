var vows = require('vows');
var options = { reporter: require('../node_modules/vows/lib/vows/reporters/spec') };

require('./diff-test.js').batch.run(options);
