import React, { Component } from 'react'

// css
import './chart.css'

//helper function
import{drawGrid} from '../helper'





class Chart extends Component {
    state={
        canvasStyle:{
            width:'',
            height:''
        },
        context:'',
        data:[],
        grid: false
        
    }

    canvasRef = React.createRef()
    contextRef = React.createRef()


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


    componentDidMount(){
        this.setState((prevState)=>({
            canvasStyle:{
                ...prevState.canvasStyle,
                width:`${this.canvasRef.current.clientWidth}px`,
                height:`${this.canvasRef.current.clientHeight}px`,
            },
            context:this.contextRef.current,
            data:[3200,9200,6050,4900,7000,5650,8000]
        }),()=>{
            this.renderGrid(this.state.context ,this.state.canvasStyle)
    
        })
        
    }

    
    render() {
        return (
            <div  ref={this.canvasRef} id="canvas-main">
                <div id="canvas-child">
                    <canvas ref={this.contextRef} style={this.state.canvasStyle}> </canvas>
                </div>
            </div>
        )
    }
}

export default Chart
