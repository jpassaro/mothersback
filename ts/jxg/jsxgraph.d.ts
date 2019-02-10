// Type definitions for JSXGraph
// Project: Mothersback
// Definitions by: John Passaro

/* tslint:disable:no-unused-expression max-classes-per-file */

export as namespace JXG;
declare enum ElementType {
    POINT = "point",
    SEGMENT = "segment",
}

declare interface EventEmitter<EVENT> {
    on: (event: EVENT, callback: (...x: any[]) => void) => void;
    off: (event: EVENT) => void;
}

declare interface GeometryAttributes {
    label?: string;
    fillColor?: string;
    [propname: string]: any;
}

declare enum GeometryEvent {
    down = "down",
    up = "up",
    drag = "drag",
    out = "out",
    over = "over",
}

declare class GeometryElement<TYPE extends ElementType, Parent>
    implements EventEmitter<GeometryEvent>
{
    public readonly label: string;
    public setAttributes(attr: GeometryAttributes): void;
    public getParents(): Parent[];
}

type PointParent = number|string|(() => number|string);
declare class Point extends GeometryElement<ElementType.POINT, PointParent> {
    public X(): number;
    public Y(): number;
}

declare class Segment extends GeometryElement<ElementType.SEGMENT, Point> {
}

declare class Board {
    public create<TYPE extends ElementType, Parent, EL extends GeometryElement<TYPE, Parent>>(
        elementType: TYPE,
        parents: Parent[],
        attributes?: GeometryAttributes,
    ): EL;
}
