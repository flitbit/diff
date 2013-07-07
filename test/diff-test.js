var vows = require('vows'),
should   = require('should'),
util     = require('util'),
diff     = require('../index').diff;

exports.batch = vows.describe('diff').addBatch({
	'A target that has no properties': {
		topic: function() { return {}; },
		'shows no differences when compared to another empty object': function(it) {
			should.not.exist(diff(it, {}));
		},
		'when compared with an object having other properties': {
			topic: function(it) {
				return diff(it, { other: 'property', another: 13.13 });
			},
			'the differences are reported': function(d) {
				should.exist(d);
				d.length.should.eql(2);

				// New property: 'other' = 'property' 
				d[0].should.have.property('kind').eql('N');
				d[0].should.have.property('path').instanceof(Array);
				d[0].path[0].should.eql('other');
				d[0].should.have.property('rhs').eql('property');
				
				// New property: 'another' = 13.13
				d[1].should.have.property('kind').eql('N');
				d[1].should.have.property('path').instanceof(Array);
				d[1].path[0].should.eql('another');
				d[1].should.have.property('rhs').eql(13.13);

			}
		}
	},
	'A target that has one property': {
		topic: function() { return { one: 'property' }; },
		'shows no differences when compared to itself': function(it) {
			should.not.exist(diff(it,it)); 
		},
		'shows the property as removed when compared to an empty object': function(it) {
			var d = diff(it, {});
			d.length.should.eql(1);
			d[0].should.have.property('kind').eql('D');
		}

	},
	'A target that has null value': {
		topic: function () { return { key: null }; },
		'shows no differences when compared to itself': function (it) {
			should.not.exist(diff(it, it));
		}
	}

});

