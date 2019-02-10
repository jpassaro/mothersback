export function labelSegment(p: string, q: string): string {
    return encodeURIComponent(p)
        + "&"
        + encodeURIComponent(q);
}
