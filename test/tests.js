var deep = require('..')
, expect = require('expect.js')
, util   = require('util')
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

	});

});

