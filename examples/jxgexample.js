let notesList = null;
let board = null;
let selectCheckBox = null;
function addNote(text) {
    notesList.appendChild(document.createElement('li')).innerHTML = text;
}

function onPointDown(event) {
    addNote('clicked on point = ' + this.name);
    event.mb_pt = this;
    if (board.mothersback.selectedPoint) {
        selectCheckBox.disabled = false;
        let prevPt = board.mothersback.selectedPoint;
        prevPt.setAttribute(board.mothersback.selectedPointOrigProps);
        board.mothersback.selectedPoint = board.mothersback.selectedPointOrigProps = null;
        let newPt = this;
        if (newPt.name < prevPt.name) {
            let tmp = newPt;
            newPt = prevPt;
            prevPt = tmp;
        }
        let existingSegments = board.mothersback.segments[prevPt.name];
        if (existingSegments && existingSegments[newPt.name]) {
            addNote('segment from ' + prevPt.name + ' to ' + newPt.name + ' already exists');
        } else {
            let newSeg = board.create('segment', [prevPt, newPt]);
            (
                existingSegments ||
                    (board.mothersback.segments[prevPt.name] = {})
            )[newPt.name] = newSeg;
            addNote('created segment from ' + prevPt.name + ' to ' + newPt.name);
        }
    } else if (event.shiftKey || (event.buttons > 1) || selectCheckBox.checked) {
        board.mothersback.selectedPoint = this;
        board.mothersback.selectedPointOrigProps = this.getAttributes;
        this.setAttribute({fillColor: "#0000f0"});  // blue
        selectCheckBox.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    notesList = document.getElementById('notes');
    addNote("dom has been loaded");
    selectCheckBox = document.getElementById('selectPoint');

    board = JXG.JSXGraph.initBoard('box', {boundingBox: [-2, 4, 6, -4]});
    board.mothersback = {segments:{}};

    board.on('down', function(event) {
        if (event.mb_pt) {
            addNote('clicked on board, with point ' + event.mb_pt.name);
        } else {
            let coords = board.getUsrCoordsOfMouse(event);
            addNote('clicked on board: creating point ' + coords);
            board.create('point', coords).on('down', onPointDown);
        }
    });

    board.create('point', [0, 0]).on('down', onPointDown);
});
