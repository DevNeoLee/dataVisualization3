//three canvas project 


//map-chart appending, projecting, and appending it in path on SVG
//canvas1 for map of canada chart, svg1
const canvas1 = d3.select('.subContainer1')
                .append('svg')
                .attr('width', '900')
                .attr('height', '600')
                .attr('class', 'map-chart');

d3.json("canadaProvinces.json").then((data) => {
    const provinces = canvas1.selectAll('g')
        .data(data.features)
        .enter()
        .append('g')
        .attr('class', 'provinces');

    const projection = d3.geoMercator()
        .scale([450])
        .translate([1277, 950]);

    const path = d3.geoPath()
        .projection(projection);

    const province = provinces.append("path")
        .attr('d', path)
        .attr('class', 'province')
        // .attr("class", function (data) { return "province" + data.id; })
        .attr('fill', 'white')

    // .append('title')
    // .text((data) => { return data.properties.PRENAME; });

    //map-chart event listener for 'mouseover' 
    document.querySelectorAll('.province').forEach(province => {
        province.addEventListener('mouseover', (e) => {
            let tooltip = document.querySelector('.tooltip');
            let x = e.pageX;     // Get the horizontal coordinate
            let y = e.pageY;
            tooltip.style.left = x + 20 + "px";
            tooltip.style.top = y + 20 + "px";
            tooltip.innerText = "monthly travel data will be here";
            // tooltip.style.opacity = 1;
            // console.log(data.features.);
            // const message = `this province had: ${data.features.PRENAME}`;  
        })
    });

    //map-chart event listner for 'mouseleave'
    document.querySelectorAll('.province').forEach(province => {
        province.addEventListener('mouseleave', (e) => {
            let tooltip = document.querySelector('.tooltip');
            // tooltip.style.opacity = 1;
            tooltip.innerText = "";
            // const message = `this province had: ${data.features.PRENAME}`;
        })
    });
    //map-chart province name display
    provinces.append('text')
        .attr('x', (data) => { return path.centroid(data)[0]; })
        .attr('y', (data) => { return path.centroid(data)[1]; })
        .attr('text-anchor', 'left')
        .style('font-size', '1rem')
        .text((data) => { return data.properties.PRENAME; });
    // data.id
});


//displays monthly data on the map-chart with graded colors on each provinces
function displayOnMap(visitorData) {
    visitorData.then(function (visitorArray) {
        //finalTrimiming of the visitor numbers to each province monthly

        const reVisitorList = [
            visitorArray[9],
            visitorArray[4],
            visitorArray[11],
            visitorArray[1],
            visitorArray[7],
            visitorArray[10],
            visitorArray[6],
            visitorArray[5],
            visitorArray[3],
            [visitorArray[1][0], "North West Territory", "0"],
            visitorArray[8],
            visitorArray[0],
            visitorArray[2]
        ].map(ele => parseInt(ele[2]));

        //d3 variables
        const margin = { top: 10, right: 5, bottom: 10, left: 20 },
            height = 600 - margin.top - margin.bottom;
        const axisData = [0, 600000];

        //define xScale
        const yScale = d3.scaleLinear()
            .domain([d3.max(axisData), d3.min(axisData)])
            .range([0, 500]);
        //define colorScale
        const colorScale = d3.scaleLinear()
            .domain([d3.min(axisData), d3.max(axisData)])
            //  .range(["#a6cee3", "#b15928"]);
            .range(["lightblue", "darkred"]);
        // coloring the province accoring to the visitor numbers     
        d3.selectAll('.province')
            .data(reVisitorList)
            // .enter()
            // .style("fill", "rgb(150, 150, 120)");
            .style("fill", function (reVistorList, i) { return colorScale(reVisitorList[i]) });
        //   console.log(Math.round(colorScale(6000)));

        // define axis
        const yAxis = d3.axisRight()
            .scale(yScale);

        // append group and insert axis
        canvas1.append('g')
            .attr('transform', 'translate(77, 50)')
            .call(yAxis);

    });
};




//canvas2
const dataSet = [80, 100, 34, 77, 91, 33 , 120, 160];

const margin2 = { top: 10, right: 10, bottom: 10, left: 30},
      width2 = 700 - margin2.right - margin2.left,
      height2 = 450 - margin2.top - margin2.bottom,
      barPadding = 5,
      barWidth = width2 / dataSet.length;
// //canvas2 for bar-chart, svg2
const canvas2 = d3.select('.subContainer2')
    .append('svg')
    .attr('width', width2 + margin2.right + margin2.left)
    .attr('height', height2 + margin2.top + margin2.bottom)
    .attr('class', 'bar-chart');
    // .append('g')
        // .attr('transform', 'translate(' + margin2.left + ',' + margin2.right + ')');
const xScale = d3.scaleBand()
    .rangeRound([0, width2])
    .domain(0, dataSet.length)
    .padding(0.3);

const yScale = d3.scaleLinear()
    .domain(Math.min(dataSet), Math.max(dataSet))
     .range([[0, height2]]);

const xAxis = d3.axisBottom()
     .scale(xScale);

const yAxis = d3.axisLeft()
     .scale(yScale);

//draw the bars
canvas2.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    // .attr('x', d => d)
    .attr('y', d => height2 - d)
    .attr('width', barWidth - barPadding)
    .attr('height',d => d)
    .attr('transform', (d, i) => (
        'translate(' + [barWidth * i, 0] + ")"
    ));
 
// canvas2.append('g')
//     .attr('class', 'x_axis')
//     .attr('transform', 'translate(10, 430)')
//     .call(xAxis);

// canvas2.append('g')
//     .attr('class', 'y_axis')
//     .attr('transform', 'translate(50, 40)')
//     .call(yAxis);













//canvas3 for pie-chart, svg3
//pie-chart
//radius
const pie_margin = { top: 5, right: 5, bottom: 5, left: 5 },
      pie_width = 300 - pie_margin.right - pie_margin.left,
      pie_height = 300 - pie_margin.top - pie_margin.bottom,
      pie_radius = pie_width / 2;

const pie_data = [23,2,45,35,55];

// define canvas3, svg
const colors = d3.scaleOrdinal(d3.schemePastel1);
const canvas3 = d3.select('.subContainer2')
    .append('svg')
    .attr('width', '700')
    .attr('height', '370');
  
//pie generator
const data2 = d3.pie()
    .sort(null)
    .value((d) => d)(pie_data);

console.log(data2);
// arc generator
const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(pie_radius)
    .padAngle(0.05)
    .padRadius(50);

const sections = canvas3
    .append('g')
    .attr('transform', 'translate(350, 200)')
    .selectAll('path').data(data2);

sections.enter()
     .append('path')
     .attr('d', arc)
     .attr('fill', function(d){return colors(d.value);});    

const content = d3.select('g')
        .selectAll('text')
        .data(data2);

content.enter()
        .append('text')
        .each(function (d) { const center = arc.centroid(d);
                            d3.select(this)
                              .attr('x', center[0])
                              .attr('y', center[1])
                             .text(d.value);
                            })

const legends = canvas3.append('g')
                        .attr('transform', 'translate(400, 300')
                        .selectAll('.legends')
                        .data(data2);

const legend = legends.enter()
                      .append('g')
                      .classed('legends', true)
                      .attr('transform', function(d, i){ return 'translate(0,'+ ( i+1 )*30 + ")";});
      legend.append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', function(d){return colors(d.value);});
      
      legend.append('text')
            .text(d => d.value)
            .attr('fill', (d) => colors(d.value))
            .attr('x', 20)
            .attr('y',30);
//append g elements(arc)
// const g = canvas3.selectAll('.arc')
//     .data(data2)
//     .attr('transform', 'translate(10 ,10)')
//     .enter().append('g')
//     .attr('class', 'arc');

// //append the path of the arc
//     g.append('path')
//         .attr('d', arc)
//         .style('fill', 'lightblue')
// //append the text(labels)
   




// getting travel data from the file, 'travel_to_canada_province'
// trims data for only
// data, place, and number of visitors from overseas
// returns the array of the info
async function travelData() {
    const newArr = [];
    let response = await fetch('travel_to_canada_province.csv');

    if (response.status == 200) {
        let data = await response.text();
        let arr = await parseCSV(data);

        arr.forEach((ele) => {
            if ((ele[1] == "Newfoundland and Labrador" ||
                ele[1] == "Prince Edward Island" ||
                ele[1] == "Nova Scotia" ||
                ele[1] == "New Brunswick" ||
                ele[1] == "Quebec" ||
                ele[1] == "Ontario" ||
                ele[1] == "Manitoba" ||
                ele[1] == "Saskatchewan" ||
                ele[1] == "Alberta" ||
                ele[1] == "British Columbia" ||
                ele[1] == "Yukon" ||
                ele[1] == "Nunavut") &&
                ele[3] == "Total non resident tourists" &&
                ele[4] == "Unadjusted" &&
                ele[0][0] == '2'
            ) {
                newArr.push([ele[0], ele[1], ele[11]]);
            }
        });
        return newArr;   
    }
    throw new Error(response.status);
};

//calculate the starting index by slicing the array of data
//returns the promise of monthly data of 12 different provinces' number of visitors as an array 
async function monthlyData(year, month) {
    const startIndex = (144 * year) + 12 * (month - 1);
    const endIndex = startIndex + 11;

    const datum = await travelData();
    const data = datum.slice(startIndex, (endIndex + 1));
    return data;
};




//selection input value eventlistener for 'change'
document.querySelector('.select').addEventListener("change", function(){
  
    // call display on the map
    const monthly = monthlyData(document.querySelector('.select').value, document.querySelector('.slider').value);
    displayOnMap(monthly);
    // displayOnBarChart(monthly);
    // displayOnLineChart(monthly);
});
    
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//range slider input
document.querySelector('.slider').addEventListener("change", function(){
    const value = document.querySelector('.slider').value;
    document.querySelector('.monthDisplay').innerText = months[value - 1];

    const monthly = monthlyData(document.querySelector('.select').value, value);
    // call display on the map
    displayOnMap(monthly);
    // displayOnBarChart(monthly);
    // displayOnLineChart(monthly);
});

//default value with the data of 2019 Jan when the webpage initializes
displayOnMap(monthlyData(19, 1));//////////testing///////////
  
   


