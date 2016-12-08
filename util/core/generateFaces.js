function generateFaces(canvas){
    return [... ((function*(){
        for (let edge of canvas.listEdges()) {
            // console.log('generateFaces [edge]'); console.log(edge);
            if (!canvas.edgeHasFace(edge)) {
                let face = makeFace(canvas, edge[0], edge[1]);
                for (let idx=0; idx<face.length; idx++) {
                    let otherEdge = [face[idx], face[(idx+1)%face.length]];
                    canvas.storeFaceForEdge(otherEdge, face);
                    // TODO test: [x,y] subsequence of
                    // canvas.edgeToFaceMap.get([x,y]) for all [x,y] in listEdges
                }
                // console.log('generateFaces'); console.log(face);
                // console.log(canvas.edgeToFaceMap);
                yield face;
            }
        }
    })())]
}

function nextInFace(canvas, now, last){
    let neighbors = [...canvas.edgeFunction(now)];
    if (neighbors.length < 2){
        throw canvas.RestrictiveAssumption('no nodes with just one neighbor');
    }
    let idx = neighbors.indexOf(last);
    let result = neighbors[(idx + 1) % neighbors.length];
    console.log(`nextInFace(now=${now}, last=${last}): nbrs=${neighbors}, idx=${idx}, next=${result}`);
    return result;
}

function makeFace(canvas, start, second){
    console.log(`makeFace(${start}, ${second})`);
    let last = start;
    let now = second;
    let face = [last, now];
    let next;
    while (
        (next = nextInFace(canvas, now, last)) != face[0] 
    ){
        face.push(next);
        last = now;
        now = next;
    }
    console.log(`make_face() = ${face}`);
    return face;
}

export default generateFaces;
