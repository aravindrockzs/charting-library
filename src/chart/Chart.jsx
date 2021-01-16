import React, { Component } from 'react'

// css
import './chart.css'

//helper function
const { drawGrid } = require('../helper')





class Chart extends Component {
    state={
        canvasStyle:{
            width:'',
            height:''
        },
        context:'',
        data:[],
        grid: false,
        chart:'line'
        
    }

    canvasRef = React.createRef()
    contextRef = React.createRef()

    selectChart=(e)=>{
        console.log(e.target.value);

        this.setState({
            chart:e.target.value
        })
    }
    


    renderGrid=(canvas)=>{
        const {width,height} = canvas.getBoundingClientRect();

        canvas.width=width;
        canvas.height= height;

        const ctx= canvas.getContext('2d')

        drawGrid(this.state.data,{width,height},ctx,canvas)
        this.setState({
            grid:true
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

        await fetch("http://api.marketstack.com/v1/eod?access_key=62378be415be5b8e1410d7534fef6593&symbols=AAPL")
        .then(response=>response.json()).then(data1=> {
            let result = data1.data;
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
            <div  className="chart-type">
                <input onClick={this.selectChart}  type="radio" id="chart1" name="chart" value="line"/>
                <label for="chart"> Line Chart</label>
                <input onClick={this.selectChart}  type="radio" id="chart2" name="chart" value="candlestick"/>
                <label for="chart"> Candlestick</label>
            </div>
            <div  ref={this.canvasRef} id="canvas-main">
                <div id="canvas-child">
                    <canvas ref={this.contextRef} style={this.state.canvasStyle}> </canvas>
                </div>
            </div>
            </>
        )
    }
}

export default Chart
