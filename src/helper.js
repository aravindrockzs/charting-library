function drawGrid(data, { width, height }, ctx, canvas) {

    let max = Math.max(...data) + 300;
    let min = Math.min(...data) - 300;
    let diff = max - min;
    //horizontal and vertical number of lines
    let vLine = 20;
    let hLine = 10;

    //grid factor for lines
    let gridX = width / vLine;
    let gridY = height / hLine;

    let spaceX = gridX;
    let spaceY = gridY;

    for (let i = 1; i < vLine + 2; i++) {
        drawLine({ x1: gridX, y1: 0, x2: gridX, y2: height }, ctx);
        gridX += spaceX;
    }
    for (let i = 1; i < hLine; i++) {
        drawLine({ x1: 0, y1: gridY, x2: width, y2: gridY }, ctx);
        gridY += spaceY;
    }
    let result = { max, min, diff, width, height, spaceX, spaceY };

    drawGraph(data, result, ctx);

    let snapshot;
    snapshot = takeSnap(canvas, ctx, snapshot)


    //mouse events

    canvas.addEventListener('mousemove', (e) => {



        let ctx = canvas.getContext('2d')
        var { x, y } = getMousePos(canvas, e);


        restoreSnap(ctx, snapshot)

        let path1 = new Path2D();
        path1.moveTo(x, y)
        path1.lineTo(width, y)
        let path2 = new Path2D(path1);
        path2.moveTo(x, y)
        path2.lineTo(x, 0)
        let path3 = new Path2D(path2)
        path3.moveTo(x, y);
        path3.lineTo(x, height)
        let path4 = new Path2D(path3)
        path4.moveTo(x, y);
        path4.lineTo(0, y)
        ctx.lineWidth = 0.8

        ctx.setLineDash([5]);
        ctx.stroke(path4)



    })


}

function drawLine({ x1, y1, x2, y2 }, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2B2B2B";
    ctx.stroke();
}


function drawGraph(data, calculated, ctx) {
    const { max, min, diff, width, height, spaceX, spaceY } = calculated;
    console.log(max, min, diff, width, height, spaceX, spaceY);

    //gives the canvas point
    let actualP = (point) => {
        return ((point - min) / diff) * height;
    };

    let length = data.length;
    let startY = data[length - 1];

    console.log(length, startY);

    let pX = 0;

    ctx.beginPath();
    ctx.moveTo(pX, 500 - actualP(startY));
    pX += spaceX;

    console.log("spliced", data.splice(length - 1, 1));

    data.reverse().map((value) => {
        console.log("Values", value);
        console.log(actualP(value));
        ctx.lineTo(pX, 500 - actualP(value));
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        pX += spaceX;
        return null;
    });
}

//snapshots

function takeSnap(canvas, ctx, snapshot) {

    return snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function restoreSnap(ctx, snapshot) {

    ctx.putImageData(snapshot, 0, 0)
}

// mouse events

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


//Crosshair


module.exports = {
    drawGrid,
    drawLine,
};
