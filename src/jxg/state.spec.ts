import {State} from './state';
import * as chai from 'chai';
import * as chaiImmutable from 'chai-immutable';
import 'mocha';

chai.use(chaiImmutable);
const expect: (any) => any = chai.expect;

describe('State', function() {
    before(function() {
        this.baseState = new State()
            .withPoint('a', [1, 2])
            .withPoint('b', [-1, 2])
            .withPoint('c', [-1, -2])
            .withPoint('d', [1, -2])
            .withPoint('orig', [0, 0])
        ;
        this.segmentedState = this.baseState
            .withSegment('a', 'b')
            .withSegment('b', 'c')
            .withSegment('c', 'd')
            .withSegment('d', 'a')
            .withSegment('orig', 'a')
            .withSegment('orig', 'b')
            .withSegment('orig', 'c')
            .withSegment('orig', 'd')
        ;
    });

    describe('basics', function() {
        it('should be empty with default constructor', function() {
            const emptyState = new State();
            expect(emptyState.points).to.be.empty;
            expect([...emptyState.listSegments()]).to.be.empty;
            expect([...emptyState.generateFaces()]).to.be.empty;
        });

        it('semantic identity does not imply strict equality', function() {
            const state1 = new State().withPoint('a', [0, 0]);
            const state2 = new State().withPoint('a', [0, 0]);
            expect(state1).to.not.equal(state2);
        });
    });

    describe('withPoint()', function() {
        it('should create new points', function() {
            expect(this.baseState.points.size).to.equal(5);
            const a = this.baseState.points.get('a');
            expect(a.label).to.equal('a');
            expect(a.x).to.equal(1);
            expect(a.y).to.equal(2);
            const b = this.baseState.points.get('b');
            expect(b.label).to.equal('b');
            expect(b.x).to.equal(-1);
            expect(b.y).to.equal(2);
        });
        it('should barf when adding the same point twice', function(done) {
            try {
                this.baseState.withPoint('a', [5, 1]);
                done(new Error('expected error did not occur'));
            } catch (e) {
                done();
            }
        });
    });
    describe('withoutPoint()', function() {
        it('should remove a point when requested', function() {
            const oneDown = this.baseState.withoutPoint('a');
            expect(oneDown.points.size).to.equal(4);
            expect(oneDown.points.has('a')).to.be.false;
            expect(oneDown.points.has('b')).to.be.true;
        });
        it('should return *this* when removing a point that is not there', function() {
            expect(this.baseState.withoutPoint('not-a-point')).to.be.equal(this.baseState);
        });
    });
    describe('withSegment()', function() {
    });
});
