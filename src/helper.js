


function drawGrid({ width, height }, ctx) {

    //horizontal and vertical number of lines
    var vLine = 20;
    var hLine = 10;

    //grid factor for lines
    var gridX = width / vLine;
    var gridY = height / hLine;

    const factorX = gridX;
    const factorY = gridY;





    for (let i = 1; i < vLine; i++) {
        drawLine({ x1: gridX, y1: 0, x2: gridX, y2: height }, ctx)
        gridX += factorX
    }



    for (let i = 1; i < hLine; i++) {
        drawLine({ x1: 0, y1: gridY, x2: width, y2: gridY }, ctx)
        gridY += factorY
    }




}


function drawLine({ x1, y1, x2, y2 }, ctx) {

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#2B2B2B";
    ctx.stroke()


}
function drawGraph(data, ctx) {


    const myData = [100, 400, 350, 200, 350, 280, 490]

    // const length = data.length
    // const factorX = 45;
    // let x = 0
    // const max = 8000;
    // const min = 3200;
    // const divider = max + min / 2

    ctx.beginPath()
    ctx.moveTo(0, 200)
    let p1 = 45

    for (let i = 0; i < 8; i++) {
        ctx.lineTo(p1, myData[i])
        ctx.lineWidth = 2
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke()
        p1 += 45

    }





    // if (!length > 0) {

    //     ctx.beginPath()
    //     const startP = data[length - 1];
    //     ctx.moveTo(0, startP / divider)

    //     data = data.splice(length - 1, 1)

    //     data.reverse().array.forEach((value) => {
    //         ctx.lineTo(x, value / divider)
    //         ctx.lineWidth = 2
    //         ctx.strokeStyle = "#2B2B2B";
    //         ctx.stroke()
    //         x += factorX


    //     })



    // }


}


module.exports = {
    drawGraph,
    drawGrid,
    drawLine
}