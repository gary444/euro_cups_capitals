import * as d3 from './modules/d3.min.js';
import TwoKeyHeatMap from './modules/TwoKeyHeatMap.js';

let data = getData()

d3.select("body").append("h1")
  .text("Hello World");

const svg_width = window.innerWidth;
const svg_height = window.innerHeight * 0.99;

//main svg container
let svgContainer = d3.select("body").append("svg")
  .attr("width", svg_width)
  .attr("height", svg_height)
  .attr("id", "main_svg")


let chartX = svg_width * 0.3
let chartY = svg_height * 0.05
let chartWidth = svg_width * 0.3
let chartHeight = svg_height * 0.9


let chart1 = new TwoKeyHeatMap (chartX, chartY, chartWidth, chartHeight, data, "yearEnd", "Decade");


function getData() {
    //create some fake data
    let data = []
    for (var i = 1955; i < 2019; i++) {
        let entry = {}
        entry.year = i
        let yearEnd = entry.year % 10
        entry.yearEnd = String(yearEnd)
        entry.Decade = String(entry.year - yearEnd) + "s"
        entry.value = (i % 3 == 0) ? 1 : 0
        data.push(entry)
    }
    return data;
}
