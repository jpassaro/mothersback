/**
 * basic.js
 * describe the basic behavior of the Canvas interface
 */
'use strict';
import 'jasmine-collection-matchers';
import 'babel-polyfill';
import Canvas from '../../util/core/canvas';
/**
 * lexicographical comparison of arrays of ints. returns the first non-zero
 * difference.
 */
function compareArray(a, b){
    if (b.length < a.length){ return - compareArray(b,a); }
    // console.log('compareArray') ; console.log(a);
    return a.map((_, i)=>(b[i]-a[i])).reduce((prev, curr) => {prev || curr || 0;});
}

/**
 * creates a copy of the given array, cycled to have the smallest element at
 * the top.
 */
function reorderCycle(arr) {
    var minIdx = arr.reduce((prevIdx, currVal, currIdx, array)=>{
        return (prevIdx==null || currVal < array[prevIdx]) ? currIdx : prevIdx;
    }, null);
    if (minIdx === 0){ return arr; }
    return arr.slice(minIdx) + arr.slice(0, minIdx);
}

function sortArrayOfArrays(arr, reorder) {
    // console.log('sortArrayOfArrays'); console.log(arr);
    arr = arr.map(reorderCycle);
    // console.log('sortArrayOfArrays2'); console.log(arr);
    arr.sort(compareArray);
    return arr;
}

let testUnique = () => {
    it('has unique points', function(){
        expect(this.cPoints).toHaveUniqueItems();
    });
    it('has unique edges', function(){
        expect(this.cEdges).toHaveUniqueItems();
    })
    it('has unique faces', function(){
        expect(this.cFaces).toHaveUniqueItems();
    })
};
describe("Canvas", function() {
    beforeEach(function() {
        this.generate = () => {
            this.canvas = new Canvas(this.points, this.edgeFunction);
            this.cPoints = [...this.canvas.listPoints()];
            this.cEdges = [...this.canvas.listEdges()];
            let faces = [...this.canvas.listFaces()];
            // console.log('generate [faces]'); console.log(faces);
            this.cFaces = sortArrayOfArrays(faces, true);

            [this.cPoints, this.cEdges, this.cFaces].forEach(
                (l) => {l.sort();}
            );
        };
        this.generatePolygon = (n) => {
            this.points = Array.apply(null, Array(n)).map((x, i) => (i));
            // approximate equivalent of python-style `range(n)`

            this.edgeFunction = (i) => { return [(i+n-1)%n, (i+1)%n]; };
            this.generate();
        };
    });
    describe("Triangle", function() {
        // a truly trivial case...
        beforeEach(function() { this.generatePolygon(3); });
        testUnique();
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
                        throw Canvas.RestrictiveAssumption(`do not put ${i} in tetrahedron edge function`);
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
