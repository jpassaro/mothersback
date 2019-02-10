import {List, Map} from "immutable";

export class StatePoint {
    public readonly data: any; // JXG.Point
    public readonly label: string;
    public readonly x: number;
    public readonly y: number;

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

    public makeNeighbor(newNeighbor: StatePoint) {
        return new Neighbor(
            newNeighbor.label,
            Math.atan2(this.y - newNeighbor.y, this.x - newNeighbor.x),
        );
    }
}

class Neighbor {
    public readonly label: string;
    public readonly angle: number;
    constructor(label: string, angle: number) {
        this.label = label;
        this.angle = angle;
    }
}

export class State {
    public readonly points: Map<string, StatePoint>;
    private readonly _adjacencies: Map<string, List<Neighbor>>;

    public constructor(
        points?: Map<string, StatePoint>,
        adjacencies?: Map<string, List<Neighbor>>,
    ) {
        this.points = points || Map();
        this._adjacencies = adjacencies || Map();
    }

    public withPoint(label: string, coords: [number, number]) {
        if (this.points.has(label)) {
            throw Error("Cannot add label '" + label + "' as it is already present");
        }
        const pt = new StatePoint({label, x: coords[0], y: coords[1]});
        return new State(this.points.set(label, pt));
    }

    public withoutPoint(label: string) {
        if (!this.points.has(label)) {
            return this;
        }
        return new State(this.points.remove(label));
    }

    public withSegment(start: string, end: string) {
        return this; // TODO stub
    }

    public withoutSegment(start: string, end: string) {
        return this; // TODO stub
    }

    public areNeighbors(x: string, y: string): boolean {
        return !! this.findNeighbor(x, y);
    }

    public *listSegments(): IterableIterator<[string, string]> {
        // TODO stub
    }

    public *generateFaces(): IterableIterator<string[]> {
        // TODO stub
    }

    private findNeighbor(x: string, y: string, skipCheck?: any): Neighbor {
        return  this._adjacencies.get(x, List())
            .filter((nbr) => nbr.label === y).first(null);
    }
}
