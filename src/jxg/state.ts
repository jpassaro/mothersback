import {List, Map} from "immutable";

class StatePoint {
    readonly data: any; // JXG.Point
    readonly label: string;
    readonly x: number;
    readonly y: number;

    constructor(kwargs: {
        data?: any,
        label: string,
        x: number,
        y: number,
    }) {
        this.data = kwargs.data;
        this.label = kwargs.label;
        this.x = kwargs.x;
        this.y = kwargs.y;
    }

    makeNeighbor(newNeighbor: StatePoint) {
        return new Neighbor(
            newNeighbor.label,
            Math.atan2(this.y - newNeighbor.y, this.x - newNeighbor.x)
        );
    }
}

class Neighbor {
    readonly label: string;
    readonly angle: number;
    constructor(label: string, angle: number) {
        this.label = label;
        this.angle = angle;
    }
}

export class State {
    readonly points: Map<string, StatePoint>;
    private readonly _adjacencies: Map<string, List<Neighbor>>;

    constructor(
        points?: Map<string, StatePoint>,
        adjacencies?: Map<string, List<Neighbor>>
    ) {
        this.points = points || Map();
        this._adjacencies = adjacencies || Map();
    }

    withPoint(label: string, coords: [number, number]) {
        if (this.points.has(label)) {
            throw Error('Cannot add label ' + label + ', you must remove it first');
        }
        let pt = new StatePoint({label, x: coords[0], y: coords[1]});
        return new State(this.points.set(label, pt));
    }
    withoutPoint(label: string) {
        if (!this.points.has(label)) {
            return this;
        }
        return new State(this.points.remove(label));
    }
    withSegment(start: string, end: string) {
        return this; // TODO stub
    }
    withoutSegment(start: string, end: string) {
        return this; // TODO stub
    }

    *listSegments(): IterableIterator<[string, string]>{
    }
    *generateFaces(): IterableIterator<string[]> {
        // TODO stub
    }
}
