import * as d3 from './d3.min.js';
// import ColourLegendVerticalStepped from './ColourLegend.js';
import * as legends from './ColourLegend.js';

const mapColor = d3.scaleSequential().domain([0,1])
    .interpolator(d3.interpolatePuOr);

function quantise(value, min, max, bands){
    let normed = (value - min) / (max - min)
    return Math.round(normed * (bands-1)) / (bands-1);
}

export default class EuroChoroplethMapStepped {

    constructor(x, y, width, height, data) {

        const bands = 9;

        //assume single svg container on page to write to
        let svgContainer = d3.select("svg")
        this.root = svgContainer.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        // background rectangle
        this.root.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "grey")

        //position offsets
        const mapXOffsetP = 0
        const mapYOffsetP = 0
        const mapWidthP = 1
        const mapHeightP = 1

        //position absolutes
        const mapXOffset = mapXOffsetP * width
        const mapYOffset = mapYOffsetP * height
        const mapWidth = mapWidthP * width
        const mapHeight = mapHeightP * height

        this.map = this.root.append("g")
            .attr("transform", "translate(" + mapXOffset + "," + mapYOffset + ")");

        var projection = d3.geoMercator()
            .scale(1)
            .translate([0, 0]);

        const pathGenerator = d3.geoPath().projection(projection);

        //load the topojson
        d3.json('data/maps/uk_eu.json') // alternative json
        // d3.json('data/maps/europe2.topojson')
            .then( (outlines) => {

                //convert topojson geometry collection to geojson feature collection
                let eu_countries = topojson.feature(outlines, outlines.objects.europe);
                let uk_countries = topojson.feature(outlines, outlines.objects.subunits);
                //merge to one feature list
                let all_countries = eu_countries;
                all_countries.features = eu_countries.features.concat(uk_countries.features);

                //calculate scale and translate from bounding box
                //stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
                let b = pathGenerator.bounds(all_countries),
                s = .95 / Math.max((b[1][0] - b[0][0]) / mapWidth, (b[1][1] - b[0][1]) / mapHeight),
                t = [(mapWidth - s * (b[1][0] + b[0][0])) / 2, (mapHeight - s * (b[1][1] + b[0][1])) / 2];

                projection
                    .scale(s)
                    .translate(t);

                //filter features for ones with names that also appear in data
                all_countries.features = all_countries.features.filter((d) => {
                    var result = data.find( (elem) => elem.name == d.properties.name);
                    if (result == undefined) console.log(d.properties.name);
                    return (result != undefined);
                });

                //draw paths
                this.map.selectAll("path")
                    .data(all_countries.features)
                    .enter().append("path")
                        .classed("countryPath", true)
                        .attr('d', pathGenerator)
                        .style("fill", (d) => {
                            // let countryData  = data.find( (elem) => elem.name == d.properties.geounit)
                            let countryData  = data.find( (elem) => elem.name == d.properties.name)
                            if (countryData == undefined) return "grey";
                            return mapColor(quantise(countryData.value, 0, 1, bands));
                        })


                //draw legend
                const legendW = width * 0.1;
                const legendH = height * 0.25;
                const legendX = width * 0.05;
                const legendY = width * 0.55;

                let legend = new legends.ColourLegendVerticalStepped(this.map, legendX, legendY, legendW, legendH, mapColor, 0, 100, bands);

            })
    }

}
