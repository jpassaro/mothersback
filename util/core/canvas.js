import generateFaces from './generateFaces';

/**
 * MBCanvas
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
 * points connected to this point by a segment, given in counter
 * clockwise order. (It doesn't really matter in that case where you
 * started as long as the order is consistent; we use counter-clockwise
 * for ordering vertex neighbors, since that direction corresponds to
 * the ordering given by atan2(y1-y0, x1-x0).)
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
 *     `this` context will always be the MBCanvas it has been passed into.
 */
function MBCanvas(points, edgeFunction) {
    this._points = [...points];
    this.edgeFunction = edgeFunction;
    this._edges = this._points.map((x) => {
        return this.edgeFunction(x).map( (y) => {return [x, y];} );
        //TODO test: [x,y] in _edges implies [y,x] in _edges
    }).reduce( (X,Y) => {return X.concat(Y);}, [] );
    this.edgeToFaceMap = new Map();
    this._faces = generateFaces(this);
}

MBCanvas.prototype.listPoints = function*() {
    yield* this._points;
};

MBCanvas.prototype.listEdges = function*() {
    yield* this._edges;
};

MBCanvas.prototype.listFaces = function*() {
    yield* this._faces;
};

// decent candidate for overriding
MBCanvas.prototype.edgeToString = (edge) => { return edge.toString(); }

MBCanvas.prototype.edgeHasFace = function(edge) {
    return this.edgeToFaceMap.has(this.edgeToString(edge));
}

MBCanvas.prototype.storeFaceForEdge = function(edge, face) {
    if (this.edgeHasFace(edge)){
        throw this.RestrictiveAssumption(
            'attempt to assign face to edge twice'
        );
    }
    return this.edgeToFaceMap.set(this.edgeToString(edge), face);
}

MBCanvas.prototype.edgeToFace = function(edge) {
    return this.edgeToFaceMap.has(this.edgeToString(edge));
}

function RestrictiveAssumption(msg){
    this.message = msg;
    this.name = 'MBCanvas Restrictive Assumption';
    this.stack = (new Error()).stack;
}
RestrictiveAssumption.prototype = Object.create(Error.prototype);
RestrictiveAssumption.prototype.constructor = RestrictiveAssumption;
MBCanvas.prototype.RestrictiveAssumption = RestrictiveAssumption;

export default MBCanvas;
