import * as d3 from './d3.min.js';

export class ColourLegendVertical {

    constructor (parent, x, y, width, height, scale, domainMin, domainMax ){

        // background rectangle
        // this.root.append("rect")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .style("fill", "black")

        this.root = parent.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        //position offsets
        const colXOffsetP = 0.5
        const colYOffsetP = 0
        const colWidthP = 0.5
        const colHeightP = 1

        //position absolutes
        const colXOffset = colXOffsetP * width
        const colYOffset = colYOffsetP * height
        const colWidth = colWidthP * width
        const colHeight = colHeightP * height

        //simple version:
        //draw individual horizontal lines per pixel

        for (var i = colYOffset; i < (colYOffset+colHeight); i++) {
            this.root.append("line")
                .attr("x1", colXOffset)
                .attr("y1", i)
                .attr("x2", colXOffset+colWidth)
                .attr("y2", i)
                .style("stroke", scale( parseFloat(i-colYOffset) / colHeight) )
                .style("stroke-width", 2)
        }

        //bounding rect for colours
        this.root.append("rect")
            .attr("x", colXOffset)
            .attr("y", colYOffset)
            .attr("width", colWidth)
            .attr("height", colHeight)
            .style("fill", "none")
            .style("stroke", "black")

        //end and middle marks and labels
        const domain = domainMax-domainMin;
        const markLengthP = 0.2;
        for (var i = 0.0; i <= 1.0; i+=0.5) {
            this.root.append("line")
                .attr("x1", colXOffset * (1-markLengthP))
                .attr("y1", colYOffset + (i * colHeight))
                .attr("x2", colXOffset)
                .attr("y2", colYOffset + (i * colHeight))
                .style("stroke", "black")
                .style("stroke-width", 1)

            this.root.append("text")
                .attr("x", colXOffset * (1-markLengthP))
                .attr("y", colYOffset + ( (i+0.025) * colHeight))
                .text(String(domainMin+ (domain*i)) )
                .classed("legendText", "true")
        }
    }
}

export class ColourLegendVerticalStepped {

    constructor (parent, x, y, width, height, scale, domainMin, domainMax, bands ){

        // background rectangle
        // this.root.append("rect")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .style("fill", "black")

        this.root = parent.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        //position offsets
        const colXOffsetP = 0.33
        const colYOffsetP = 0
        const colWidthP = 0.34
        const colHeightP = 1

        //position absolutes
        const colXOffset = colXOffsetP * width
        const colYOffset = colYOffsetP * height
        const colWidth = colWidthP * width
        const colHeight = colHeightP * height

        //draw rect per band

        const bandHeight = colHeight / bands;
        const bandNormedValue = 1 / (bands-1);
        const bandValue = 1 / bands * (domainMax-domainMin);

        for (var i = 0; i < bands; i++) {

            //colour rects
            this.root.append("rect")
                .attr("x", colXOffset)
                .attr("y", colYOffset + i*bandHeight)
                .attr("width", colWidth)
                .attr("height", colHeight/bands)
                .style("fill", scale(i*bandNormedValue) )

            //labels
            //determine bounds of region:
            
            //left text
            this.root.append("text")
                .attr("x", colXOffset * 0.8)
                .attr("y", colYOffset + (i+0.75)*bandHeight)
                .text(+ String(parseFloat(i*bandValue).toPrecision(3)))
                .classed("legendText", "true")

            //right legendText
            this.root.append("text")
                .attr("x", (colXOffset+colWidth) + (colXOffset * 0.2))
                .attr("y", colYOffset + (i+0.75)*bandHeight)
                .text(String( +parseFloat((i+1)*bandValue).toPrecision(3) ))
                .classed("legendText", "true")
                .style("text-anchor", "start")
        }

        //bounding rect for colours
        this.root.append("rect")
            .attr("x", colXOffset)
            .attr("y", colYOffset)
            .attr("width", colWidth)
            .attr("height", colHeight)
            .style("fill", "none")
            .style("stroke", "black")

    }
}
