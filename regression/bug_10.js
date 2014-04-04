var util = require('util')
, deep   = require('..')
, expect = require('expect.js')
;

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

var diff = deep.diff(lhs, rhs);

util.log('\r\n' + util.inspect(diff, false, 99));


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

var applied = deep.applyDiff(lhs, rhs);
