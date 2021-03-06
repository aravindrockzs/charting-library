import React from 'react'

// css
import './chart.css'

//helper function
const { drawGrid , gradChange } = require('../helper')





class Chart extends React.Component {

    constructor(){
        super()

        this.state={
            canvasStyle:{
                width:'',
                height:''
            },
            context:'',
            data:[],
            padY:10,
            grid: false,
            chartType:'line'
        }


    }
    canvasRef = React.createRef()
    contextRef = React.createRef()

    selectChart= async (e)=>{

        this.setState({
                chartType:e.target.value
            })
        if(e.target.value==='line'){
            await fetch("https://api.jsonbin.io/b/6004dadff98f6e35d5fdca2a")
            .then(response=>response.json()).then(data=> {
            let result = data;
            result.length=10;
            let sample = result.map((value)=>{
                return value['close'];
            })
            this.setState({
                data: sample
            },()=>{
                this.renderGrid(this.state.context ,this.state.canvasStyle)
                })
            })

        }

        else if(e.target.value==='candlestick' || 'barchart' || 'heikenashi'){
            this.setState({
                chartType:e.target.value
            })

            await fetch("https://api.jsonbin.io/b/6004dadff98f6e35d5fdca2a")
            .then(response=>response.json()).then(data=> {
            let result = data;
            result.length=10;
            this.setState({
                data: result
            },()=>{

            this.renderGrid(this.state.context ,this.state.canvasStyle)
            })
        })
        }
        
    }
    


    renderGrid=(canvas)=>{
        const {width,height} = canvas.getBoundingClientRect();

        let scale = window.devicePixelRatio;


        canvas.width=width*scale;
        canvas.height= height*scale;
        const ctx= canvas.getContext('2d')

        ctx.scale(scale,scale)

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        drawGrid(this.state.data,{width,height},ctx,canvas,this.state.chartType,this.state.padY)
        this.setState({
            grid:true
        })
    }

    gradResize(e){
        let canvas = this.state.context
        let gY = gradChange(e,this.state.padY)


        console.log(gY);

        const {width,height} = canvas.getBoundingClientRect();
        const ctx= canvas.getContext('2d')


        this.setState({
            padY:gY,
        },()=>{
            drawGrid(this.state.data,{width,height},ctx,canvas,this.state.chartType,this.state.padY)
        })
        
    }


    componentDidMount= async()=>{
        this.setState((prevState)=>({
            canvasStyle:{
                ...prevState.canvasStyle,
                width:`${this.canvasRef.current.clientWidth}px`,
                height:`${this.canvasRef.current.clientHeight}px`,
            },
            context:this.contextRef.current,
        }))
        //https://api.jsonbin.io/b/6004dadff98f6e35d5fdca2a

        //http://api.marketstack.com/v1/eod?access_key=62378be415be5b8e1410d7534fef6593&symbols=AAPL

        await fetch("https://api.jsonbin.io/b/6004dadff98f6e35d5fdca2a")
        .then(response=>response.json())
        .then(data=> {
        let result = data;
        result.length = 10;
        let sample = result.map((value)=>{
            return value['close'];
        })
        this.setState({
            data: sample
        },()=>{

        this.renderGrid(this.state.context ,this.state.canvasStyle)
        })
    })


    }

    
    render() {
        return (
            <>
            <div className="chart-type">
                <input onClick={(e)=>this.selectChart(e)}  type="radio" id="chart1" name="chart" value="line"/>
                <label> Line Chart</label>
                <input onClick={(e)=>this.selectChart(e)}  type="radio" id="chart2" name="chart" value="candlestick"/>
                <label> Candlestick</label>
                <input onClick={(e)=>this.selectChart(e)}  type="radio" id="chart3" name="chart" value="barchart"/>
                <label> Bar</label>
                <input onClick={(e)=>this.selectChart(e)}  type="radio" id="chart4" name="chart" value="heikenashi"/>
                <label> Heiken Ashi</label>
            </div>
            <div  ref={this.canvasRef} id="canvas-main">
                <div id="canvas-child">
                    <canvas onWheel ={(e)=>this.gradResize(e)}ref={this.contextRef} style={this.state.canvasStyle}> </canvas>
                </div>
            </div>
            </>
        )
    }
}

export default Chart
