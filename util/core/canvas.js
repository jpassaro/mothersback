import generateFaces from './generateFaces';

/**
 * Canvas
 *
 * An extremely abstract representation of a layout of points and edges
 * between them. The edges are specified via a function which takes one
 * argument, assumed to be in `points`, and returns an ordered list of
 * points that are "neighbors" to the given point.
 *
 * An important point is that the (circular) order of these points must
 * be consistent. The first one may legally vary: what must be true is
 * that any result concatenated endlessly would be the same, up to
 * chopping off a few items at the front.
 *
 * A useful model can be seen in R^2. If we have "edges" as
 * line-segments in R^2, the result from this function would be the
 * points connected to this point by a segment, given in clockwise
 * order. It doesn't really matter in that case where you started as
 * long as the order is consistent.
 *
 * This is enough information first to determine the faces, and second
 * to create the definition of a path through the canvas that is the
 * true export of this library.
 *
 * @param points
 *     list or iterator of points. These must support some kind of total
 *     order, and of course equality and hasing, but apart from that
 *     they can be really anything.
 * @param edgeFunction
 *     function which takes exactly one point and returns a list of
 *     neighbors, consistently-ordered as described above. Note that its
 *     `this` context will always be the Canvas it has been passed into.
 */
function Canvas(points, edgeFunction) {
    this._points = [...points];
    this.edgeFunction = edgeFunction;
    this._edges = this._points.map((x) => {
        return this.edgeFunction(x).map( (y) => {return [x, y];} );
        //TODO test: [x,y] in _edges implies [y,x] in _edges
    }).reduce( (X,Y) => {return X.concat(Y);}, [] );
    this.edgeToFaceMap = new Map();
    this._faces = generateFaces(this);
}

Canvas.prototype.listPoints = function*() {
    yield* this._points;
};

Canvas.prototype.listEdges = function*() {
    yield* this._edges;
};

Canvas.prototype.listFaces = function*() {
    yield* this._faces;
};

// decent candidate for overriding
Canvas.prototype.edgeToString = (edge) => { return edge.toString(); }

Canvas.prototype.edgeHasFace = function(edge) {
    return this.edgeToFaceMap.has(this.edgeToString(edge));
}

Canvas.prototype.storeFaceForEdge = function(edge, face) {
    if (this.edgeHasFace(edge)){
        throw this.RestrictiveError('attempt to assign face to edge twice');
    }
    return this.edgeToFaceMap.set(this.edgeToString(edge), face);
}

Canvas.prototype.edgeToFace = function(edge) {
    return this.edgeToFaceMap.has(this.edgeToString(edge));
}

function RestrictiveAssumption(msg){
    this.message = msg;
    this.name = 'Canvas Restrictive Assumption';
    this.stack = (new Error()).stack;
}
RestrictiveAssumption.prototype = Object.create(Error.prototype);
RestrictiveAssumption.prototype.constructor = RestrictiveAssumption;
Canvas.prototype.RestrictiveAssumption = RestrictiveAssumption;

export default Canvas;
