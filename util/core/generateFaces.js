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

function nextInFace(canvas, a, b){
    let neighbors = [...canvas.edgeFunction(a)];
    if (neighbors.length < 2){
        throw canvas.RestrictiveAssumption('no nodes with just one neighbor');
    }
    let idx = neighbors.indexOf(b);
    let result = neighbors[(idx + 1) % neighbors.length];
    return result;
}

function makeFace(canvas, a, b){
    let face = [a, b];
    let next;
    while ( (next = nextInFace(canvas, a, b)) != face[0] ){
        face.push(next);
        a = b;
        b = next;
    }
    return face;
}

export default generateFaces;
