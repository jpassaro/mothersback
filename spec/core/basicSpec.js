/**
 * basic.js
 * describe the basic behavior of the MBCanvas interface
 */
'use strict';
import 'jasmine-collection-matchers';
import 'babel-polyfill';
import MBCanvas from '../../util/core/canvas';


describe("MBCanvas", function() {
    beforeEach(function() {
        this.generate = () => {
            this.canvas = new MBCanvas({points: this.points});
        };
        this.generatePolygon = (n) => {
            this.n = n;
            this.indices = Array.apply(null, Array(n)).map((x, i) => i);
            this.points = this.indices.map(
                // approximate equivalent of python-style `range(n)`
                i => {id: "v"+i, edges: ["e"+i, "e"+((i+n-1)%n)]}
            );
        };
        this.testPolygon = () => {
            let idget = x => x.id;
            let vertexIds = this.canvas.points.map(idget);
            expect(vertexIds).toEqual(this.indices.map(i => "v"+i));
            let edgeIds = this.canvas.edges.map(idget);
            expect(edgeIds).toEqual(this.indices.map(i => "e"+i))
            expect(this.canvas.faces.map(idget)).toEqual(["face_0", "face_1"]);

            let edgelists = this.canvas.points.map(x => x.edges);
            expect(edgelists.map(x => x.length)).toEqual(this.indices.map(i => 2));
            expect(edgelists.map(x => x[0])).toEqual(edgeIds);
            expect(edgelists.slice(0, this.n-1).map(x => x[1])).toEqual(edgeIds.slice(1));
            expect(edgelists[this.n-1][1]).toEqual(edgeIds[0]);

            let faces0 = indices.map(i => "face_0");
            let faces1 = indices.map(i => "face_1");
            let facelists = this.canvas.points.map(x => x.faces);
            expect(facelists.map(x => x.length)).toEqual(this.indices.map(i => 2));
            expect(facelists.map(x => x[0])).toEqual(faces0);
            expect(facelists.map(x => x[1])).toEqual(faces1);

            this.canvas.edges.forEach((edge, idx) => {
                let startIdx = vertexIds.indexOf(edge.start);
                let endIdx = vertexIds.indexOf(edge.end);
            });
        }
    });
    describe("Triangle", function() {
        // a truly trivial case...
        beforeEach(function() { this.generatePolygon(3); });
        testPolygon(canvas, 3);
        it('has three points', function() {
            expect(this.points).toEqual([0, 1, 2]);
        });
        it('has three edges', function() {
            // each listed twice, forwards and backwards
            expect(this.cEdges).toEqual([
                [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]
            ]);
        });
        it('has "one" face', function() {
            // in fact it is two... one the bottom and one the top,
            // so to speak.
            // console.log([...this.canvas.listFaces()]);
            expect(this.cFaces).toEqual([ [0, 1, 2], [0, 2, 1] ]);
        });
    });
    describe("Tetrahedron", function() {
        /* tetrahedron in ASCII art:
         *     1
         *   / | \
         *  /  |  \
         * |   0   |
         * | /   \ |
         * 3 ----- 2
         */
        beforeEach(function() {
            this.points = Array.apply(null, Array(4)).map((x, i) => (i));
            this.edgeFunction = (i) => {
                switch(i) {
                    case 0:
                        // Let's count them counter clockwise
                        return [1, 3, 2];
                    case 1:
                        // Picture turning the object so 1 is in the middle
                        return [0, 2, 3];
                    case 2:
                        // likewise
                        return [0, 3, 1];
                    case 3:
                        return [0, 1, 2];
                    default:
                        throw MBCanvas.RestrictiveAssumption(`do not put ${i} in tetrahedron edge function`);
                }
            };
            this.generate();
        });
        it('has four points', function() {
            expect(this.points).toEqual([0, 1, 2, 3]);
        });
        it('has six edges', function() {
            expect(this.cEdges).toEqual([
                [0, 1], [0, 2], [0, 3], [1, 0], [1, 2], [1, 3],
                [2, 0], [2, 1], [2, 3], [3, 0], [3, 1], [3, 2]
            ]);
        });
        it('has four faces', function() {
            // the faces we must count clockwise, the opposite of the
            // edge order
            expect(this.cFaces).toEqual([
                [0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]
            ]);
        });

    });
});
