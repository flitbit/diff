/*jshint indent:2, laxcomma:true, laxbreak:true*/
var util = require('util')
, expect = require('expect.js')
, eql    = require('deep-equal')
, deep   = require('..')
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

    var diff = deep.diff(lhs, rhs);

      // there should be differences
      expect(diff).to.be.ok();
      expect(diff.length).to.be(6);


      // It.phases[0].id changed from 'Phase1' to 'Phase2'
      //
      expect(diff[0].kind).to.be('E');
      expect(diff[0].path).to.be.an('array');
      expect(diff[0].path).to.have.length(3);
      expect(diff[0].path[0]).to.be('phases');
      expect(diff[0].path[1]).to.be(0);
      expect(diff[0].path[2]).to.be('id');
      expect(diff[0].lhs).to.be('Phase1');
      expect(diff[0].rhs).to.be('Phase2');

      // It.phases[0].tasks[0].id changed from 'Task1' to 'Task3'
      //
      expect(diff[1].kind).to.be('E');
      expect(diff[1].path).to.be.an('array');
      expect(diff[1].path).to.have.length(5);
      expect(diff[1].path[0]).to.be('phases');
      expect(diff[1].path[1]).to.be(0);
      expect(diff[1].path[2]).to.be('tasks');
      expect(diff[1].path[3]).to.be(0);
      expect(diff[1].path[4]).to.be('id');
      expect(diff[1].lhs).to.be('Task1');
      expect(diff[1].rhs).to.be('Task3');

      // It.phases[0].tasks[1] was deleted
      //
      expect(diff[2].kind).to.be('A');
      expect(diff[2].path).to.be.an('array');
      expect(diff[2].path).to.have.length(3);
      expect(diff[2].path[0]).to.be('phases');
      expect(diff[2].path[1]).to.be(0);
      expect(diff[2].path[2]).to.be('tasks');
      expect(diff[2].index).to.be(1);
      expect(diff[2].item.kind).to.be('D');

      // It.phases[1].id changed from 'Phase2' to 'Phase1'
      //
      expect(diff[3].kind).to.be('E');
      expect(diff[3].path).to.be.an('array');
      expect(diff[3].path).to.have.length(3);
      expect(diff[3].path[0]).to.be('phases');
      expect(diff[3].path[1]).to.be(1);
      expect(diff[3].path[2]).to.be('id');
      expect(diff[3].lhs).to.be('Phase2');
      expect(diff[3].rhs).to.be('Phase1');

      // It.phases[1].tasks[0].id changed from 'Task3' to 'Task1'
      //
      expect(diff[4].kind).to.be('E');
      expect(diff[4].path).to.be.an('array');
      expect(diff[4].path).to.have.length(5);
      expect(diff[4].path[0]).to.be('phases');
      expect(diff[4].path[1]).to.be(1);
      expect(diff[4].path[2]).to.be('tasks');
      expect(diff[4].path[3]).to.be(0);
      expect(diff[4].path[4]).to.be('id');
      expect(diff[4].lhs).to.be('Task3');
      expect(diff[4].rhs).to.be('Task1');

      // It.phases[1].tasks[1] is new
      //
      expect(diff[5].kind).to.be('A');
			expect(diff[5].path).to.be.an('array');
      expect(diff[5].path).to.have.length(3);
      expect(diff[5].path[0]).to.be('phases');
      expect(diff[5].path[1]).to.be(1);
      expect(diff[5].path[2]).to.be('tasks');
      expect(diff[5].index).to.be(1);
      expect(diff[5].item.kind).to.be('N');

      var applied = deep.applyDiff(lhs, rhs);
