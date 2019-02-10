import {labelSegment} from "./util";


enum SurfacePartType {
    Point = "POINT",
    Segment = "SEGMENT",
    Face = "FACE",
}

interface FaceOrPoint {
    kind: SurfacePartType.Point | SurfacePartType.Face;
    label: string;
}

interface Segment {
    kind: SurfacePartType.Segment;
    start: string;
    end: string;
}

function isSegment(x: Segment | FaceOrPoint): x is Segment {
    return x.kind === SurfacePartType.Segment;
}

function encodeSurfacePart(x: Segment | FaceOrPoint): string {
    return x.kind + ":" +
        isSegment(x) ? labelSegment(x.start, x.end)
                     : encodeURIComponent(x.label)
    ;
}

function checkDecodeURIComponent(encoded: string): string {
    let decoded = decodeURIComponent(encoded);
    if (encoded !== encodeURIComponent(decoded)) {
        throw Error(`badly encoded string '${x}'`);
    }
    return decoded;
}

function decodeSurfacePart(x: string): Segment | FaceOrPoint {
    let colon = x.indexOf(":");
    if (colon < 1) {
        throw Error("whoops");
    }
    let kind = x.substring(0, colon);
    if (kind === SurfacePartType.Segment) {
        let ampersand = x.indexOf("&", colon + 1);
        if (ampersand <= colon) {
            throw Error("whoops");
        }
        return {
            kind,
            start: checkDecodeURIComponent(x.slice(colon+1, ampersand)),
            end: checkDecodeURIComponent(x.slice(ampersand+1)),
    } else if (kind === SurfacePartType.Point || kind === SurfacePartType.Face) {
        return { kind, label: checkDecodeURIComponent(x.slice(colon + 1)) };
    }
}
