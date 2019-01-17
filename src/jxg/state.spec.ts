import {State} from "./state";

import * as chai from "chai";
import * as chaiImmutable from "chai-immutable";
import {List, Set} from "immutable";
import "mocha";

chai.use(chaiImmutable);
const expect: (x: any) => any = chai.expect;
const assert = chai.assert;

const canonicalizeSegment: (a: string[]) => List<string> = (segment) => {
    expect(segment).to.have.size(2);
    expect(segment[0]).to.not.equal(segment[1]);
    return List(segment[0] < segment[1] ? segment : [segment[1], segment[0]]);
};

const compareSegments: (a: Set<string[]>, b: State) => void  = (expectedSegments, actualState) => {
    const canonicalSegments: List<List<string>> = List(actualState.listSegments())
        .map(canonicalizeSegment);
    const canonSegmentsDeduped = Set(canonicalSegments);
    expect(canonSegmentsDeduped).to.have.size(canonicalSegments.size);
    expect(canonSegmentsDeduped).to.equal(expectedSegments.map(List));
};

const canonicalizeFace: (a: string[]) => List<string> = (face) => {
    if (! face) {
        return List();
    }
    let minPoint: string = null;
    let minIndex: number = -1;
    let potentialDuplicates: Set<string> = Set();
    for (let i = 0 ; i < face.length; i++) {
        const point = face[i];
        expect(point).to.be.true();
        expect(potentialDuplicates).to.not.contain(point);
        if (minPoint === null || point < minPoint) {
            minPoint = point;
            minIndex = i;
        }
        potentialDuplicates = potentialDuplicates.add(point);
    }
    return List(minIndex === 0 ? face : (
        face.slice(minIndex).concat(face.slice(0, minIndex))
    ));
};

const compareFaces: (a: Set<string[]>, b: State) => void  = (expectedFaces, actualState) => {
    const canonicalFaces: List<List<string>> = List(actualState.generateFaces())
        .map(canonicalizeFace);
    const canonFacesDeduped = Set(canonicalFaces);
    expect(canonFacesDeduped).to.have.size(canonicalFaces.size);
    expect(canonFacesDeduped).to.equal(expectedFaces.map(List));
};

describe("State", function() {
    before(function() {
        this.baseState = new State()
            .withPoint("a", [1, 2])
            .withPoint("b", [-1, 2])
            .withPoint("c", [-1, -2])
            .withPoint("d", [1, -2])
            .withPoint("orig", [0, 0])
            .withSegment("b", "c")
            .withSegment("c", "d")
            .withSegment("orig", "a")
            .withSegment("orig", "b")
            .withSegment("orig", "c")
            .withSegment("orig", "d")
        ;
        this.baseExpectedSegments = Set(
            [["a", "b"], ["b", "c"], ["c", "d"]].concat(["a", "b", "c", "d"].map((x) => [x, "orig"])),
        );
    });

    it("should be empty with default constructor", function() {
        const emptyState = new State();
        expect(emptyState.points).to.be.empty;
        expect([...emptyState.listSegments()]).to.be.empty;
        expect([...emptyState.generateFaces()]).to.be.empty;
    });

    it("semantic identity does not imply strict equality", function() {
        const state1 = new State().withPoint("a", [0, 0])
            .withPoint("b", [1, 1])
            .withSegment("a", "b");
        const state2 = new State().withPoint("a", [0, 0])
            .withPoint("b", [1, 1])
            .withSegment("a", "b");
        expect(state1).to.not.equal(state2);
    });

    describe("listSegments()", function() {
        it("should have expected segments", function() {
            compareSegments(this.baseExpectedSegments, this.baseState);
        });
    });

    describe("generateFaces()", function() {
        it("should have exactly the hull of the complex and its innermost polygons");
        xit("how does it handle multiple connected components?");
        it("should include exactly those edges and points that are part of the graph and do not form a cycle");
    });

    describe("withPoint()", function() {
        it("should create new points", function() {
            expect(this.baseState.points.size).to.equal(5);
            const a = this.baseState.points.get("a");
            expect(a.label).to.equal("a");
            expect(a.x).to.equal(1);
            expect(a.y).to.equal(2);
            const b = this.baseState.points.get("b");
            expect(b.label).to.equal("b");
            expect(b.x).to.equal(-1);
            expect(b.y).to.equal(2);
        });
        it("should barf when adding the same point with different coords", function() {
            expect(() => this.baseState.withPoint("a", [5, 1]))
                .to.throw(Error).and.match(/'a'.*already present/i);
        });
        it("should barf when adding an identical point to one that is already present", function() {
            expect(() => this.baseState.withPoint("a", [1, 2]))
                .to.throw(Error).and.match(/'a'.*already present/i);
        });
        it("should gain no new segments when adding a new point");
        it("should gain no new faces when adding a new point");
    });
    describe("withoutPoint()", function() {
        it("should remove a point when requested", function() {
            const oneDown = this.baseState.withoutPoint("a");
            expect(oneDown.points.size).to.equal(4);
            expect(oneDown.points.has("a")).to.be.false;
            expect(oneDown.points.has("b")).to.be.true;
        });
        it("should barf when removing a point that is not there");
        it("should also remove segments on the given point");
        it("should preserve all faces which do not include the given point");
        it("should have only faces (maybe new) which do not include the given point");
    });
    describe("withSegment()", function() {
        it("should reflect a newly added segment");
        it("should barf when adding a segment with a nonexistent point");
        it("should barf when adding a segment from one point to itself");
        it("should barf when adding a segment that is already present");
        it("should add the same segment regardless of which is specified first");
        it("should result in a new face when adding a segment that completes a new graph cycle");
        it("should not add a new face when adding a segment that does not complete a cycle");
    });
    describe("withoutSegment()", function() {
        it("should reflect a newly removed segment");
        it("should barf when removing a segment that is already present");
        it("should remove the same segment regardless of which is specified first");
    });
});
