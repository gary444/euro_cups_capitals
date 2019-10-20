import * as d3 from './modules/d3.min.js';
import TwoKeyHeatMap from './modules/TwoKeyHeatMap_euro.js';
import EuroChoroplethMapStepped from './modules/EuroChoroplethMapStepped.js';


d3.select("body").append("h1")
  .text("Hello World");

const svg_width = window.innerWidth;
const svg_height = window.innerHeight * 0.99;

//main svg container
let svgContainer = d3.select("body").append("svg")
  .attr("width", svg_width)
  .attr("height", svg_height)
  .attr("id", "main_svg")


let chartX = svg_width * 0.2
let chartY = svg_height * 0.05
let chartWidth = svg_width * 0.4
let chartHeight = svg_height * 0.9

//load data for heat map

d3.csv('data/euroCupCapitals.csv').then( (capitalData) => {

    let data = []

    capitalData.forEach( (d) => {
        let entry = {}
        entry.year = d.year
        let yearEnd = entry.year % 10
        entry.yearEnd = String(yearEnd)
        entry.Decade = String(entry.year - yearEnd) + "s"

        entry.team = d.team
        entry.city = d.city
        entry.value = d.isCapital
        data.push(entry)
    })

    // let chart1 = new TwoKeyHeatMap (chartX, chartY, chartWidth, chartHeight, data, "yearEnd", "Decade");

});



// load map
let mapX = svg_width * 0.25
let mapY = 0
let mapWidth = svg_width * 0.5
let mapHeight = svg_height * 0.8


d3.csv('data/FAKEcapitalSuccessPerCountry.csv').then( (countryCapitalSuccess) => {

    console.log(countryCapitalSuccess);

    let map1 = new EuroChoroplethMapStepped(mapX, mapY, mapWidth, mapHeight, countryCapitalSuccess);
});


// function getData() {
//     // //create some fake data
//     // let data = []
//     // for (var i = 1955; i < 2019; i++) {
//     //     let entry = {}
//     //     entry.year = i
//     //     let yearEnd = entry.year % 10
//     //     entry.yearEnd = String(yearEnd)
//     //     entry.Decade = String(entry.year - yearEnd) + "s"
//     //     entry.value = (i % 3 == 0) ? 1 : 0
//     //     data.push(entry)
//     // }
//     // return data;
//
//
// }
