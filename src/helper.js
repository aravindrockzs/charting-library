function drawGrid(data, { width, height }, ctx, canvas, chartType, padY) {
    let checkSnap = true;
    let min, max;
    let type = chartType;
    let diff;



    let pad = padY ? padY : 0


    // console.log("raw", data);

    let pointsArray = [];

    if (type === 'line') {

        ctx.clearRect(0, 0, width, height);
        max = Math.max(...data) + pad;
        min = Math.min(...data) - pad;

    }

    else if (type === 'candlestick' || 'barchart' || 'heikenashi') {

        ctx.clearRect(0, 0, width, height);
        let high = data.map(value => value.high);
        let low = data.map(value => value.low);
        max = Math.max(...high) + pad;
        min = Math.min(...low) - pad;
    }

    //width of the graduations
    width = width - 80;

    diff = max - min;


    //horizontal and vertical number of lines
    let vLine = 20;
    let hLine = 10;


    let totalH = (diff + 60);

    let diffH = totalH / hLine;

    // console.log(totalH);

    //grid factor for lines
    let gridX = width / vLine;
    let gridY = height / hLine;

    let spaceX = gridX;
    let spaceY = gridY;



    for (let i = 1; i < vLine + 2; i++) {
        drawLine({ x1: gridX, y1: 0, x2: gridX, y2: height }, ctx);
        gridX += spaceX;

        if (gridX > width) break;
    }

    let gradH = max + 30;
    gradH -= diffH;
    for (let i = 1; i < hLine; i++) {
        drawLine({ x1: 0, y1: gridY, x2: width, y2: gridY }, ctx);

        ctx.beginPath()
        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`${gradH.toFixed(2)}`, width + 5, gridY);

        gridY += spaceY;
        gradH -= diffH;
    }
    let result = { max, min, diff, width, height, spaceX, spaceY };



    if (type === 'line') {
        drawGraphLine(data, result, ctx, pointsArray);
    }

    else if (type === 'candlestick') {
        drawGraphCandle(data, result, ctx, pointsArray);
    }

    else if (type === 'barchart') {
        drawGraphBar(data, result, ctx, pointsArray);
    }

    else if (type === 'heikenashi') {
        drawGraphHeikenAshi(data, result, ctx, pointsArray);
    }




    let snapshot;

    //mouse events

    let showHair = true;

    canvas.addEventListener('mousemove', (e) => {
        // let ctx = canvas.getContext('2d')
        var { x } = getMousePos(canvas, e);

        //if pointer moves towards the graduation
        if (x > width) {
            showHair = false;
        }
        else {
            showHair = true;
        }
    })

    canvas.addEventListener('mousedown', (e) => {
        let ctx = canvas.getContext('2d')
        var { x, y } = getMousePos(canvas, e);
        restoreSnap(ctx, snapshot)
        drawCrosshair(ctx, x, y, width, height, showHair)

    })

    canvas.addEventListener('mousemove', (e) => {
        let ctx = canvas.getContext('2d')
        var { x, y } = getMousePos(canvas, e);
        restoreSnap(ctx, snapshot)
        drawCrosshair(ctx, x, y, width, height, showHair)

        if (checkSnap && type === 'line') {
            pointsArray.map((value) => {
                if (value.x >= x - 12 && value.x <= x + 12 && value.y >= y - 12 && value.y <= y + 12) {

                    restoreSnap(ctx, snapshot)
                    ctx.beginPath();
                    ctx.setLineDash([]);
                    ctx.lineWidth = 1.6;
                    ctx.fillStyle = "#FF0000";
                    ctx.arc(value.x, value.y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
                return null;
            })
        }

    })

    snapshot = takeSnap(canvas, ctx, snapshot)
}



function drawLine({ x1, y1, x2, y2 }, ctx) {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2B2B2B";
    ctx.stroke();

}

// for candlestick chart
function drawGraphCandle(data, calculated, ctx, pointsArray) {
    const { min, diff, height, spaceX } = calculated;

    let actualP = (point) => {
        return ((point - min) / diff) * height;
    };


    let pX = 0;
    let myData = [...data];

    myData.reverse().map((value) => {
        ctx.beginPath();
        ctx.setLineDash([]);
        let { high, low, open, close } = value
        ctx.moveTo(pX, 500 - actualP(high))
        ctx.lineTo(pX, 500 - actualP(low))

        if (close > open) {
            ctx.strokeStyle = "#519C58"
        }
        else if (close < open) {
            ctx.strokeStyle = "#E3415D"
        }
        ctx.lineWidth = 2;
        ctx.stroke();

        // for drawing rectangles

        ctx.beginPath();
        ctx.setLineDash([]);

        if (close > open) {
            ctx.strokeStyle = "#519C58"
            ctx.fillStyle = "#519C58"
            ctx.fillRect(pX - 5, 500 - actualP(close), 10, actualP(close) - actualP(open))
        }

        else if (close < open) {
            ctx.strokeStyle = "#E3415D"
            ctx.fillStyle = "#E3415D"
            ctx.fillRect(pX - 5, 500 - actualP(open), 10, actualP(open) - actualP(close))
        }

        pointsArray.push({ x: pX, y1: 500 - actualP(high), y2: 500 - actualP(low), y3: 500 - actualP(open), y4: 500 - actualP(close) })

        ctx.stroke();
        pX += spaceX;
        return null;
    })


}

function drawGraphBar(data, calculated, ctx, pointsArray) {
    const { min, diff, height, spaceX } = calculated;

    let actualP = (point) => {
        return ((point - min) / diff) * height;
    };


    let pX = 0;
    let myData = [...data];

    myData.reverse().map((value) => {
        ctx.beginPath();
        ctx.setLineDash([]);
        let { high, low, open, close } = value
        ctx.moveTo(pX, 500 - actualP(high))
        ctx.lineTo(pX, 500 - actualP(low))

        if (close > open) {
            ctx.strokeStyle = "#519C58"
        }
        else if (close < open) {
            ctx.strokeStyle = "#E3415D"
        }
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath()
        ctx.setLineDash([]);
        //drawing left and right bars
        if (close > open) {
            ctx.strokeStyle = "#519C58"
            ctx.moveTo(pX, 500 - actualP(close))
            ctx.lineTo(pX + 8, 500 - actualP(close))
            ctx.stroke()

            ctx.moveTo(pX, 500 - actualP(open))
            ctx.lineTo(pX - 8, 500 - actualP(open))
            ctx.stroke()
        }

        else if (close < open) {
            ctx.strokeStyle = "#E3415D"

            ctx.moveTo(pX, 500 - actualP(open))
            ctx.lineTo(pX - 8, 500 - actualP(open))
            ctx.stroke()

            ctx.moveTo(pX, 500 - actualP(close))
            ctx.lineTo(pX + 8, 500 - actualP(close))
            ctx.stroke()

        }


        pX += spaceX;
        return null;
    })


}

function drawGraphHeikenAshi(data, calculated, ctx, pointsArray) {


    const { min, diff, height, spaceX } = calculated;

    let actualP = (point) => {
        return ((point - min) / diff) * height;
    };


    let pX = 0;
    let myData = [...data];

    //let p = previous bar
    // let H = heikenashi bar

    // formula
    // Close= 1/4 (Open+Close+Low+Close)
    // (The average price of the current bar)
    // Open= 1/2(Open of Prev. Bar+Close of Prev. Bar)
    // (The midpoint of the previous bar)
    // High=Max[High, Open, Close]
    // Low=Min[Low, Open, Close]

    let firstcandle = true;
    let openP, closeP, openH, closeH, highH, lowH;


    myData.reverse().map((value) => {
        ctx.beginPath();
        ctx.setLineDash([]);
        let { high, low, open, close } = value

        if (firstcandle) {
            closeH = ((open + high + close + low) / 4)
            openH = ((open + close) / 2)
            ctx.moveTo(pX, 500 - actualP(high))
            ctx.lineTo(pX, 500 - actualP(low))

            console.log('first candle', closeH, openH);
        }

        else {
            closeH = ((open + high + close + low) / 4)
            openH = ((openP + closeP) / 2)
            highH = Math.max(high, open, close)
            lowH = Math.min(low, open, close)
            ctx.moveTo(pX, 500 - actualP(highH))
            ctx.lineTo(pX, 500 - actualP(lowH))

        }

        if (closeH > openH) {
            ctx.strokeStyle = "#519C58"
        }
        else if (closeH < openH) {
            ctx.strokeStyle = "#E3415D"
        }
        ctx.lineWidth = 2;
        ctx.stroke();

        // for drawing rectangles

        ctx.beginPath();
        ctx.setLineDash([]);

        if (closeH > openH) {
            ctx.strokeStyle = "#519C58"
            ctx.fillStyle = "#519C58"
            ctx.fillRect(pX - 5, 500 - actualP(closeH), 10, actualP(closeH) - actualP(openH))
        }

        else if (closeH < openH) {
            ctx.strokeStyle = "#E3415D"
            ctx.fillStyle = "#E3415D"
            ctx.fillRect(pX - 5, 500 - actualP(openH), 10, actualP(openH) - actualP(closeH))
        }


        openP = openH;
        closeP = closeH;

        ctx.stroke();
        pX += spaceX;
        firstcandle = false;
        return null;
    })


}

//for line chart

function drawGraphLine(data, calculated, ctx, pointsArray) {
    const { max, min, diff, width, height, spaceX, spaceY } = calculated;
    console.log(max, min, diff, width, height, spaceX, spaceY);

    //gives the canvas point
    let actualP = (point) => {
        return ((point - min) / diff) * height;
    };

    let length = data.length;
    let startY = data[length - 1];



    let pX = 0;

    ctx.beginPath();
    ctx.setLineDash([]);

    ctx.moveTo(pX, 500 - actualP(startY));
    pX += spaceX;

    let myData = [...data];

    console.log(myData.splice(length - 1, 1));

    myData.reverse().map((value) => {
        ctx.lineTo(pX, 500 - actualP(value));
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        pointsArray.push({ x: pX, y: 500 - actualP(value) })
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        pX += spaceX;
        return null;
    });

}

//storing and retreiving min max



// for graduation changes

function gradChange(e, padY) {

    if (e.deltaY < 0) {

        console.log("wheeling up")
        if (padY <= 0) return padY = 0;
        return padY -= 5;

    }

    else if (e.deltaY > 0) {

        console.log("wheeling down")
        return padY += 5;

    }

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

function drawCrosshair(ctx, x, y, width, height, showHair) {
    if (showHair === true) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(width, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x, 0);
        ctx.moveTo(x, y);
        ctx.lineTo(x, height);
        ctx.moveTo(x, y);
        ctx.lineTo(0, y);
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 0.8;
        ctx.setLineDash([5]);
        ctx.stroke();
    }
    else return;


}


module.exports = {
    drawGrid,
    drawLine,
    gradChange
};
