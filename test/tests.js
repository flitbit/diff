if (typeof require === 'function') {
	var expect = require('expect.js'),
	DeepDiff = require('..')
	;
}
var deep = DeepDiff
, executingInBrowser = 'undefined' !== typeof window
;

describe('deep-diff', function() {
	var empty = {}
	;

	describe('A target that has no properties', function() {

		it('shows no differences when compared to another empty object', function() {
			expect(deep.diff(empty, {})).to.be.an('undefined');
		});

		describe('when compared with an object having other properties', function() {
			var comparand = { other: 'property', another: 13.13 };
			var diff = deep.diff(empty, comparand);

			it('the differences are reported', function() {
				expect(diff).to.be.ok();
				expect(diff.length).to.be(2);

				expect(diff[0]).to.have.property('kind');
				expect(diff[0].kind).to.be('N');
				expect(diff[0]).to.have.property('path');
				expect(diff[0].path).to.be.an(Array);
				expect(diff[0].path[0]).to.eql('other');
				expect(diff[0]).to.have.property('rhs');
				expect(diff[0].rhs).to.be('property');

				expect(diff[1]).to.have.property('kind');
				expect(diff[1].kind).to.be('N');
				expect(diff[1]).to.have.property('path');
				expect(diff[1].path).to.be.an(Array);
				expect(diff[1].path[0]).to.eql('another');
				expect(diff[1]).to.have.property('rhs');
				expect(diff[1].rhs).to.be(13.13);
			});

		});

	});

	describe('A target that has one property', function() {
		var lhs = { one: 'property' };

		it('shows no differences when compared to itself', function() {
			expect(deep.diff(lhs, lhs)).to.be.an('undefined');
		});

		it('shows the property as removed when compared to an empty object', function() {
			var diff = deep.diff(lhs, empty);
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('D');
		});

		it('shows the property as edited when compared to an object with null', function() {
			var diff = deep.diff(lhs, { one: null });
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
		});

	});

	describe('A target that has null value', function() {
		var lhs = { key: null };

		it('shows no differences when compared to itself', function() {
			expect(deep.diff(lhs, lhs)).to.be.an('undefined');
		});

		it('shows the property as removed when compared to an empty object', function() {
			var diff = deep.diff(lhs, empty);
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('D');
		});

		it('shows the property is changed when compared to an object that has value', function() {
			var diff = deep.diff(lhs, { key: 'value' });
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
		});

		it('shows that an object property is changed when it is set to null', function() {
			lhs.key = {nested: 'value'};
			var diff = deep.diff(lhs, { key: null });
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
		});

	});


	describe('A target that has a date value', function() {
		var lhs = { key: new Date(555555555555) };

		it('shows the property is changed with a new date value', function() {
			var diff = deep.diff(lhs, { key: new Date(777777777777) });
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
		});

	});


	describe('When executing in a browser (otherwise these tests are benign)', function() {

		it('#isConflict reports conflict in the global namespace for `DeepDiff`', function() {
// the browser test harness sets up a conflict.
			if (executingInBrowser) {
				expect(DeepDiff.isConflict).to.be.ok();
			}
		});

		it('#noConflict restores prior definition for the global `DeepDiff`', function() {
// the browser test harness sets up a conflict.
			if (executingInBrowser) {
				expect(DeepDiff.isConflict).to.be.ok();
				var another = DeepDiff.noConflict();
				expect(another).to.be(deep);
				expect(DeepDiff).to.be(DeepDiffConflict);
			}
		});

	});

	describe('A target that has nested values', function() {
		var nestedOne = { noChange: 'same', levelOne: { levelTwo: 'value' } };
		var nestedTwo = { noChange: 'same', levelOne: { levelTwo: 'another value' } };

		it('shows no differences when compared to itself', function() {
			expect(deep.diff(nestedOne, nestedOne)).to.be.an('undefined');
		});

		it('shows the property as removed when compared to an empty object', function() {
			var diff = deep(nestedOne, empty);
			expect(diff).to.be.ok();
			expect(diff.length).to.be(2);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('D');
			expect(diff[1]).to.have.property('kind');
			expect(diff[1].kind).to.be('D');
		});

		it('shows the property is changed when compared to an object that has value', function() {
			var diff = deep.diff(nestedOne, nestedTwo);
			expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
		});

		it('shows the property as added when compared to an empty object on left', function() {
			var diff = deep.diff(empty, nestedOne);
			expect(diff).to.be.ok();
			expect(diff.length).to.be(2);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('N');
		});

		describe('when diff is applied to a different empty object', function () {
			var diff = deep.diff(nestedOne, nestedTwo);
			var result = {};

			it('has result with nested values', function() {
				deep.applyChange(result, nestedTwo, diff[0]);
				expect(result.levelOne).to.be.ok();
				expect(result.levelOne).to.be.an('object');
				expect(result.levelOne.levelTwo).to.be.ok();
				expect(result.levelOne.levelTwo).to.eql('another value');
			});

		});

	});

});
