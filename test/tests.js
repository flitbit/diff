/*global DeepDiffConflict: false, document*/
'use strict';

if (typeof require === 'function') {
    var expect = require('expect.js'),
        util = require('util'),
        DeepDiff = require('..');
}
var deep = DeepDiff,
    executingInBrowser = 'undefined' !== typeof window;

describe('deep-diff', function() {
    var empty = {};

    describe('A target that has no properties', function() {

        it('shows no differences when compared to another empty object', function() {
            expect(deep.diff(empty, {})).to.be.an('undefined');
        });

        describe('when compared to a different type of keyless object', function() {
            var ctor = function() {
                this.foo = 'bar';
            };
            var comparandTuples = [
                ['an array', {
                    key: []
                }],
                ['an object', {
                    key: {}
                }],
                ['a date', {
                    key: new Date()
                }],
                ['a null', {
                    key: null
                }],
                ['a regexp literal', {
                    key: /a/
                }],
                ['Math', {
                    key: Math
                }]
            ];

            comparandTuples.forEach(function(lhsTuple) {
                comparandTuples.forEach(function(rhsTuple) {
                    if (lhsTuple[0] === rhsTuple[0]) {
                        return;
                    }
                    it('shows differences when comparing ' + lhsTuple[0] + ' to ' + rhsTuple[0], function() {
                        var diff = deep.diff(lhsTuple[1], rhsTuple[1]);
                        expect(diff).to.be.ok();
                        expect(diff.length).to.be(1);
                        expect(diff[0]).to.have.property('kind');
                        expect(diff[0].kind).to.be('E');
                    });
                });
            });
        });

        describe('when compared with an object having other properties', function() {
            var comparand = {
                other: 'property',
                another: 13.13
            };
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
        var lhs = {
            one: 'property'
        };

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
            var diff = deep.diff(lhs, {
                one: null
            });
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

        it('shows the property as edited when compared to an array', function() {
            var diff = deep.diff(lhs, ['one']);
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

    });

    describe('A target that has null value', function() {
        var lhs = {
            key: null
        };

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
            var diff = deep.diff(lhs, {
                key: 'value'
            });
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

        it('shows that an object property is changed when it is set to null', function() {
            lhs.key = {
                nested: 'value'
            };
            var diff = deep.diff(lhs, {
                key: null
            });
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

    });


    describe('A target that has a date value', function() {
        var lhs = {
            key: new Date(555555555555)
        };

        it('shows the property is changed with a new date value', function() {
            var diff = deep.diff(lhs, {
                key: new Date(777777777777)
            });
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

    });


    describe('A target that has a NaN', function() {
        var lhs = {
            key: NaN
        };

        it('shows the property is changed when compared to another number', function() {
            var diff = deep.diff(lhs, {
                key: 0
            });
            expect(diff).to.be.ok();
            expect(diff.length).to.be(1);
            expect(diff[0]).to.have.property('kind');
            expect(diff[0].kind).to.be('E');
        });

        it('shows no differences when compared to another NaN', function() {
            var diff = deep.diff(lhs, {
                key: NaN
            });
            expect(diff).to.be.an('undefined');
        });

    });


    describe('When executing in a browser (otherwise these tests are benign)', function() {

        it('#isConflict reports conflict in the global namespace for `DeepDiff`', function() {
            // the browser test harness sets up a conflict.
            if (executingInBrowser) {
                expect(DeepDiff.isConflict()).to.be.ok();
            }
        });

        it('#noConflict restores prior definition for the global `DeepDiff`', function() {
            // the browser test harness sets up a conflict.
            if (executingInBrowser) {
                expect(DeepDiff.isConflict()).to.be.ok();
                var another = DeepDiff.noConflict();
                expect(another).to.be(deep);
                expect(DeepDiff).to.be(DeepDiffConflict);
            }
        });

    });



    describe('When filtering keys', function() {
        var lhs = {
            enhancement: 'Filter/Ignore Keys?',
            numero: 11,
            submitted_by: 'ericclemmons',
            supported_by: ['ericclemmons'],
            status: 'open'
        };
        var rhs = {
            enhancement: 'Filter/Ignore Keys?',
            numero: 11,
            submitted_by: 'ericclemmons',
            supported_by: [
                'ericclemmons',
                'TylerGarlick',
                'flitbit',
                'ergdev'
            ],
            status: 'closed',
            fixed_by: 'flitbit'
        };

        describe('if the filtered property is an array', function() {

            it('changes to the array do not appear as a difference', function() {
                var prefilter = function(path, key) {
                    return key === 'supported_by';
                };
                var diff = deep(lhs, rhs, prefilter);
                expect(diff).to.be.ok();
                expect(diff.length).to.be(2);
                expect(diff[0]).to.have.property('kind');
                expect(diff[0].kind).to.be('E');
                expect(diff[1]).to.have.property('kind');
                expect(diff[1].kind).to.be('N');
            });

        });

        describe('if the filtered property is not an array', function() {

            it('changes do not appear as a difference', function() {
                var prefilter = function(path, key) {
                    return key === 'fixed_by';
                };
                var diff = deep(lhs, rhs, prefilter);
                expect(diff).to.be.ok();
                expect(diff.length).to.be(4);
                expect(diff[0]).to.have.property('kind');
                expect(diff[0].kind).to.be('A');
                expect(diff[1]).to.have.property('kind');
                expect(diff[1].kind).to.be('A');
                expect(diff[2]).to.have.property('kind');
                expect(diff[2].kind).to.be('A');
                expect(diff[3]).to.have.property('kind');
                expect(diff[3].kind).to.be('E');
            });

        });
    });

    describe('A target that has nested values', function() {
        var nestedOne = {
            noChange: 'same',
            levelOne: {
                levelTwo: 'value'
            }
        };
        var nestedTwo = {
            noChange: 'same',
            levelOne: {
                levelTwo: 'another value'
            }
        };

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

        describe('when diff is applied to a different empty object', function() {
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
            id: 'Release',
            phases: [{
                id: 'Phase1',
                tasks: [{
                    id: 'Task1'
                }, {
                    id: 'Task2'
                }]
            }, {
                id: 'Phase2',
                tasks: [{
                    id: 'Task3'
                }]
            }]
        };
        var rhs = {
            id: 'Release',
            phases: [{
                // E: Phase1 -> Phase2
                id: 'Phase2',
                tasks: [{
                    id: 'Task3'
                }]
            }, {
                id: 'Phase1',
                tasks: [{
                    id: 'Task1'
                }, {
                    id: 'Task2'
                }]
            }]
        };

        describe('differences in nested arrays are detected', function() {
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

            it('differences can be applied', function() {
                var applied = deep.applyDiff(lhs, rhs);

                it('and the result equals the rhs', function() {

                });

            });
        });

    });

    describe('regression test for bug #35', function() {
        var lhs = ['a', 'a', 'a'];
        var rhs = ['a'];

        it('can apply diffs between two top level arrays', function() {
            var differences = deep.diff(lhs, rhs);

            /* We must apply the differences in reverse order, since the array indices
             in the diff become stale/invalid if you delete elements from the array
             whose indices are in ascending order */
            for (var i = differences.length - 1; i >= 0; i--) {
                deep.applyChange(lhs, true, differences[i]);
            }

            expect(lhs).to.eql(['a']);
        });
    });

    describe('Objects from different frames', function() {
        if (!executingInBrowser) return;

        var frame = document.createElement('iframe');
        document.body.appendChild(frame);

        var lhs = new frame.contentWindow.Date(2010,1,1);
        var rhs = new frame.contentWindow.Date(2010,1,1);

        it('can compare date instances from a different frame', function() {
            var differences = deep.diff(lhs, rhs);

            expect(differences).to.be(undefined);
        });
    });

    describe('Comparing regexes should work', function() {
        var lhs = /foo/;
        var rhs = /foo/i;

        it('can compare regex instances', function() {
            var diff = deep.diff(lhs, rhs);

            expect(diff.length).to.be(1);

            expect(diff[0].kind).to.be('E');
            expect(diff[0].path).to.not.be.ok();
            expect(diff[0].lhs).to.be('/foo/');
            expect(diff[0].rhs).to.be('/foo/i');
        });
    });

});
