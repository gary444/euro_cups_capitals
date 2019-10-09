import * as d3 from './d3.min.js';

// expects an array of data objects with 2 keys and value

// keys are named in constructor
// key 1: horizontal
// key 2: vertical

// value: range [0-1] will be automatically mapped to colour


// map data point to colour
function getColour(data){

    if (data.value == 1) return "#C1292E"
    else return "#235789"
    //select return colour scale
    // var myColor = d3.scaleSequential().domain([0,1])
    //     .interpolator(d3.interpolatePuOr);
    // return myColor(data.value)
}

export default class TwoKeyHeatMap {

    constructor(x, y, width, height, data, key1, key2){

        //assume single svg container on page to write to
        let svgContainer = d3.select("svg")
        this.root = svgContainer.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        //background rectangle
        // this.root.append("rect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", width)
        //     .attr("height", height)
        //     .style("fill", "grey")

        //Create ordered list of unique keys
        let allKeys1 = []
        let allKeys2 = []
        data.forEach( (d) => {
            allKeys1.push(d[key1])
            allKeys2.push(d[key2])
        })
        this.keys1 = Array.from( new Set(allKeys1) ).sort();
        this.keys2 = Array.from( new Set(allKeys2) ).sort();

        //rendering variables
        this.marks = this.root.append("g")

        //title sizes
        let titleOffsetYPc = 0.1
        let subtitleOffsetYPc = 0.05

        //calculate total offsets (top and left)
        let chartXOffsetPc = 0.15
        let chartYOffsetPc = titleOffsetYPc + subtitleOffsetYPc
        let chartXOffset = chartXOffsetPc * width
        let chartYOffset = chartYOffsetPc * height

        //space for legendSqs
        let legendSizePc = 0.1
        let legendSize = legendSizePc * height;

        //calculate padding (right and bottom)
        let chartXPadPc = 0.05
        let chartYPadPc = 0.05
        let chartXPad = chartXPadPc * width
        let chartYPad = chartYPadPc * height

        let markAreaX = width - chartXOffset - chartXPad
        let markAreaY = height - chartYOffset - chartYPad - legendSize
        let maxMarkWidth = markAreaX / this.keys1.length
        let maxMarkHeight = markAreaY / this.keys2.length

        //to enforce square marks
        maxMarkWidth = Math.min(maxMarkWidth, maxMarkHeight)
        maxMarkHeight = maxMarkWidth;

        let padXPc = 0.2
        let padYPc = 0.2



        let markWidth = maxMarkWidth * (1.0-padXPc)
        let markHeight = maxMarkHeight * (1.0-padYPc)

        //draw marks
        this.marks.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .classed("heatMapMark", true)
            .attr("x", (d) => {
                var index = this.keys1.findIndex( (elem) => {return elem == d[key1];} )
                return chartXOffset + index * maxMarkWidth;
             })
             .attr("y", (d) => {
                 var index = this.keys2.findIndex( (elem) => {return elem == d[key2];} )
                 return chartYOffset + index * maxMarkHeight;
              })
             .attr('width', markWidth)
             .attr('height', markHeight)
             .style("fill", getColour)


        //labels

        //title
        this.root.append("text")
            .classed("heatMapText", true)
            .classed("heatMapTitle", true)
            .attr("x", width/2)
            .attr("y", height*0.05)
            .text("Champions League Winners")

        //subtitle
        this.root.append("text")
            .classed("heatMapText", true)
            .classed("heatMapSubtitle", true)
            .attr("x", width/2)
            .attr("y", height*titleOffsetYPc)
            .text("Capital Cities v Non-Capital Cities")

        // y axis label
        this.root.append("text")
            .classed("heatMapText", true)
            .classed("heatMapYAxisLabel", true)
            .attr("transform", "translate(" + (chartXOffset * 0.2) + ","
                + (chartYOffset + (0.5*maxMarkHeight*this.keys2.length)) + ") rotate(-90)")
            .text(key2)

        // x axis label
        // this.root.append("text")
        //     .classed("heatMapText", true)
        //     .classed("heatMapXAxisLabel", true)
        //     .attr("x", chartXOffset + markAreaX*0.5)
        //     .attr("y", chartYOffset * 0.9)
        //     .text(key1)

        // y axis channel labels
        this.ylabels = this.root.append("g")
        this.ylabels.selectAll("text")
            .data(this.keys2).enter()
            .append("text")
                .classed("heatMapText", true)
                .classed("heatMapYLabel", true)
                .attr("x", chartXOffset * 0.8)
                .attr("y", (d,i) => { return chartYOffset + (i+0.5) * maxMarkHeight})
                .text((d) => {return d;} )

        // x axis labels
        // this.xlabels = this.root.append("g")
        // this.xlabels.selectAll("text")
        //     .data(this.keys1).enter()
        //     .append("text")
        //         .classed("heatMapText", true)
        //         .classed("heatMapXLabel", true)
        //         .attr("x", (d,i) => { return chartXOffset + (i+0.5) * maxMarkWidth})
        //         .attr("y", chartYOffset * 0.9)
        //         .text((d) => {return d;} )



        //draw legend
        //discrete colours
        let legendSqs = [{value:0, label:"Non-Capital Club"},
                        {value:1, label:"Capital Club"}]
        this.legend = this.root.append("g")
        this.legend.selectAll("rect").data(legendSqs).enter()
            .append("rect")
            .attr("x", (d,i)=>{
                if (i==0) return width/2-maxMarkWidth;
                else return width/2+(maxMarkWidth*padXPc); })
            .attr("y", chartYOffset + maxMarkHeight*(this.keys2.length+0.5))
            .attr("width", markWidth)
            .attr("height", markHeight)
            .style("fill", (d)=>{return getColour(d);})
        this.legend.selectAll("text").data(legendSqs).enter()
            .append("text")
            .classed("heatMapText", true)
            .classed("heatMapLegendText", true)
            .text((d)=>d.label)
            .attr("x", (d,i)=>{
                if (i==0) return width/2-(maxMarkWidth*(1+padXPc));
                else return width/2+(maxMarkWidth*(1+padXPc)); })
            .attr("y", chartYOffset + maxMarkHeight*(this.keys2.length+1.25))
            .style("text-anchor", (d,i) => {
                if (i == 0) return "end";
                else return "start";
            })



    }


}
