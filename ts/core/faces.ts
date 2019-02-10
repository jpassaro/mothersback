import {List, Map} from "immutable";
import {labelSegment} from "./util";

interface LabelledPoint {
    readonly label: string;
}

interface PointSystem<P extends LabelledPoint> {
    /**
     * Contract:
     *   for any string x,
     *   points[x] === undefined || points[x].label === x
     */
    readonly points: Map<string, P>;

    /**
     * Contract:
     *   if points.has(x) is true, then
     *     listNeighbors(x) is valid.
     *   if p = [...listNeighbors(x)], then
     *     * for all 0 <= i < p.length:
     *         * points.has(p[i]) is true.
     *         * x != p[i]. (i.e. no loops)
     *         * if p[j] === p[i] then j === i.
     *           (i.e. no double-edges)
     *         * x is in listNeighbors(p[i]).
     *           (i.e. adirectional)
     *     * if q = [...listNeighbors(x)], then p and q are
     *       identical modulo rotation shifting. I.e.:
     *         * p.length === q.length.
     *         * p equals some slice of q.concat(q).
     */
    readonly listNeighbors: (label: string) => IterableIterator<string>;
}

class FaceSystem<P extends LabelledPoint> {
    public readonly pointSystem: PointSystem<P>;
    public faces: Map<string, List<string>>;

    public constructor(pointSystem: PointSystem<P>) {
        this.pointSystem = pointSystem;
        this.faces = buildFaces(pointSystem);
    }
}

function buildFaces<P extends LabelledPoint>(pointsys: PointSystem<P>): Map<string, List<string>> {
    const faces: Map<string, List<string>> = Map<string,List<string>>().asMutable();
    const faceLabelBySegment: Map<string, Map<string, string>> = pointsys.points.keySeq()
        .map(p => [p, Map().asMutable()])
        .update(Map);
    for (const p of pointsys.points.keys()) {
        for (const q of pointsys.listNeighbors(p)) {
            if (faceLabelBySegment.get(p).has(q)) {
                continue;
            }
            const label: string = labelSegment(p, q);
            const face = [];
            let base = p, next = q;
            while (next != q || !face) {
                face.push(base);
                faceLabelBySegment.get(base).set(next, label);
                const nextCands = [...pointsys.listNeighbors(next)];
                const nextIdx = (nextCands.indexOf(base) + 1) % nextCands.length;
                base = next;
                next = nextCands[nextIdx];
            }
            faces.set(label, List(face));
        }
    }
    return faces.asImmutable();
}
