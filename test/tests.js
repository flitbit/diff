if (typeof require === 'function') {
	var expect = require('expect.js'),
	util = require('util'),
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


  describe('A target that has a NaN', function() {
    var lhs = { key: NaN };

    it('shows the property is changed when compared to another number', function() {
      var diff = deep.diff(lhs, { key: 0 });
      expect(diff).to.be.ok();
			expect(diff.length).to.be(1);
			expect(diff[0]).to.have.property('kind');
			expect(diff[0].kind).to.be('E');
    });

    it('shows no differences when compared to another NaN', function() {
      var diff = deep.diff(lhs, { key: NaN });
      expect(diff).to.be.an('undefined');
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

	describe('regression test for bug #10, ', function() {
		var lhs = {
			"id": "Release",
			"phases": [{
				"id": "Phase1",
				"tasks": [
				{"id": "Task1"},
				{"id": "Task2"}
				]
			}, {
				"id": "Phase2",
				"tasks": [
				{"id": "Task3"}
				]
			}]
		};
		var rhs = {
			"id": "Release",
			"phases": [{
				// E: Phase1 -> Phase2
				"id": "Phase2",
				"tasks": [
				{"id": "Task3"}
				]
			}, {
				"id": "Phase1",
				"tasks": [
				{"id": "Task1"},
				{"id": "Task2"}
				]
			}]
		};

		describe('differences in nested arrays are detected', function() {
			var diff = deep.diff(lhs, rhs);

			// there should be differences
			expect(diff).to.be.ok();
			expect(diff.length).to.be(6);


			// It.phases[0].id changed from 'Phase1' to 'Phase2'
			//
			expect(diff[0].kind).to.be('A');
			expect(diff[0].path).to.be.an('array');
			expect(diff[0].path).to.have.length(1);
			expect(diff[0].path).to.contain('phases');
			expect(diff[0].index).to.be(0);
			expect(diff[0].item.kind).to.be('E');
			expect(diff[0].item.path).to.have.length(1);
			expect(diff[0].item.path).to.contain('id');
			expect(diff[0].item.lhs).to.be('Phase1');
			expect(diff[0].item.rhs).to.be('Phase2');

			// It.phases[0].tasks[0].id changed from 'Task1' to 'Task3'
			//
			expect(diff[1].kind).to.be('A');
			expect(diff[1].path).to.be.an('array');
			expect(diff[1].path).to.have.length(1);
			expect(diff[1].path).to.contain('phases');
			expect(diff[1].index).to.be(0);
			expect(diff[1].item.kind).to.be('A');
			expect(diff[1].item.path).to.be.an('array');
			expect(diff[1].item.path).to.have.length(1);
			expect(diff[1].item.path).to.contain('tasks');
			expect(diff[1].item.index).to.be(0);
			expect(diff[1].item.item.kind).to.be('E');
			expect(diff[1].item.item.path).to.have.length(1);
			expect(diff[1].item.item.path).to.contain('id');
			expect(diff[1].item.item.lhs).to.be('Task1');
			expect(diff[1].item.item.rhs).to.be('Task3');

			// It.phases[0].tasks[1] was deleted
			//
			expect(diff[2].kind).to.be('A');
			expect(diff[2].path).to.be.an('array');
			expect(diff[2].path).to.have.length(1);
			expect(diff[2].path).to.contain('phases');
			expect(diff[2].index).to.be(0);
			expect(diff[2].item.kind).to.be('A');
			expect(diff[2].item.path).to.be.an('array');
			expect(diff[2].item.path).to.have.length(1);
			expect(diff[2].item.path).to.contain('tasks');
			expect(diff[2].item.index).to.be(1);
			expect(diff[2].item.item.kind).to.be('D');

			// It.phases[1].id changed from 'Phase1' to 'Phase2'
			//
			expect(diff[3].kind).to.be('A');
			expect(diff[3].path).to.be.an('array');
			expect(diff[3].path).to.have.length(1);
			expect(diff[3].path).to.contain('phases');
			expect(diff[3].index).to.be(1);
			expect(diff[3].item.kind).to.be('E');
			expect(diff[3].item.path).to.have.length(1);
			expect(diff[3].item.path).to.contain('id');
			expect(diff[3].item.lhs).to.be('Phase2');
			expect(diff[3].item.rhs).to.be('Phase1');

 			// It.phases[1].tasks[0].id changed from 'Task3' to 'Task1'
			//
			expect(diff[4].kind).to.be('A');
			expect(diff[4].path).to.be.an('array');
			expect(diff[4].path).to.have.length(1);
			expect(diff[4].path).to.contain('phases');
			expect(diff[4].index).to.be(1);
			expect(diff[4].item.kind).to.be('A');
			expect(diff[4].item.path).to.be.an('array');
			expect(diff[4].item.path).to.have.length(1);
			expect(diff[4].item.path).to.contain('tasks');
			expect(diff[4].item.index).to.be(0);
			expect(diff[4].item.item.kind).to.be('E');
			expect(diff[4].item.item.path).to.have.length(1);
			expect(diff[4].item.item.path).to.contain('id');
			expect(diff[4].item.item.lhs).to.be('Task3');
			expect(diff[4].item.item.rhs).to.be('Task1');


			// It.phases[1].tasks[1] is new
			//
			expect(diff[5].kind).to.be('A');
			expect(diff[5].path).to.be.an('array');
			expect(diff[5].path).to.have.length(1);
			expect(diff[5].path).to.contain('phases');
			expect(diff[5].index).to.be(1);
			expect(diff[5].item.kind).to.be('A');
			expect(diff[5].item.path).to.be.an('array');
			expect(diff[5].item.path).to.have.length(1);
			expect(diff[5].item.path).to.contain('tasks');
			expect(diff[5].item.index).to.be(1);
			expect(diff[5].item.item.kind).to.be('N');

			it('differences can be applied', function() {
				var applied = deep.applyDiff(lhs, rhs);

				it('and the result equals the rhs', function() {

				});

			});
		});

	});

});
