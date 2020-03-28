
//three canvas for '.displayContainer' 
//canvas1 for map of canada chart, svg1
const canvas1 = d3.select('.displayContainer')
                .append('svg')
                .attr('width', '850')
                .attr('height', '610')
                .style('background-color', '#eeeeee')
                .attr('class', 'map-chart')
                .style('display', 'grid');
 
//canvas2 for bar-chart, svg2
const canvas2 = d3.select('.displayContainer')
                    .append('svg')
                    .attr('width', '450')
                    .attr('height', '610')
                    .style('background-color', '#999999')
                    .attr('class', 'bar-chart')
                    .style('display', 'grid');

//canvas3 for line-chart, svg3
const canvas3 = d3.select('.displayContainer')
                    .append('svg')
                    .attr('width', '250')
                    .attr('height', '310')
                    .style('background-color', '#777777')
                    .attr('class', 'line-chart')
                    .style('display', 'grid');

//map-chart appending, projecting, and appending it in path on SVG
d3.json("canadaProvinces.json").then((data) => {  
    const provinces = canvas1.selectAll('g')
                            .data(data.features)
                            .enter()
                            .append('g')
                            .attr('class', 'provinces');

    const projection = d3.geoMercator()
                        .scale([450])
                        .translate([1150, 930]);

    const path = d3.geoPath()
                    .projection(projection);

    const province = provinces.append("path")
                                .attr('d', path)
                                .attr('class', 'province')
                                // .attr("class", function (data) { return "province" + data.id; })
                                .attr('fill', 'steelblue')
        
                                // .append('title')
                                // .text((data) => { return data.properties.PRENAME; });
       
    //map-chart event listener for 'mouseover' 
    document.querySelectorAll('.province').forEach(province => { province.addEventListener('mouseover', (e) => {
        let tooltip = document.querySelector('.tooltip');
        let x = e.pageX;     // Get the horizontal coordinate
        let y = e.pageY;
        tooltip.style.left = x + 20 + "px";
        tooltip.style.top = y + 20 + "px";
        tooltip.innerText = "hello there";
        // tooltip.style.opacity = 1;
        // console.log(data.features.);
        // const message = `this province had: ${data.features.PRENAME}`;  
    })});

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
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text((data) => { return data.properties.PRENAME +"( "+ data.id + " )"; });

});







// getting travel data from the file, 'travel_to_canada_province'
// trims data for only data, place, and number of visitors from overseas
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


//displays monthly data on the map-chart with graded colors on each provinces
function displayOnMap(visitorData) {
     visitorData.then(function(visitorArray) {
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
        const margin = { top: 10, right: 5, bottom: 10, left: 20},
              height = 600 - margin.top - margin.bottom;
        const axisData = reVisitorList;
       
        //define xScale
        const yScale = d3.scaleLinear()
                    .domain([d3.min(axisData), d3.max(axisData)])      
                    .range([height, 0]);

        //define colorScale
         const colorScale = d3.scaleLinear()
                     .domain([d3.min(axisData), d3.max(axisData)])
                    .range([0, 255]);

        // coloring the province accoring to the visitor numbers     
        d3.selectAll('.province')// 13개의 다른 지도 지역들에다가....순서대로...
            .data(reVisitorList) // 방문자 숫자순서대로
            // .enter()
            // .style("fill", "rgb(150, 150, 120)");
            .style("fill", function (reVistorList, i) { return "rgb(150, 150," + (Math.round(colorScale(reVisitorList[i]))) +  ")"});        
        //   console.log(Math.round(colorScale(6000)));

         // define axis
         const yAxis = d3.axisRight()
             .scale(yScale);

        // append group and insert axis
         canvas1.append('g')
             .attr('transform', 'translate(767, 10)')
             .call(yAxis);    

        }); 

    // document.querySelectorAll('.province').forEach((province) => {
         
    // });
    // console.log(data.text())
    // d3.selectAll('.province')
    //     .data(data)
    //     .enter()
        // .attr({
        //     "x": function (data) { return xScale(data.features) }
        // })
        // .attr("fill", "orange");
        // .style("fill", function (data, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')' });
};

displayOnMap(monthlyData(1, 7));//////////testing///////////

//selection input value eventlistener for 'change'
document.querySelector('.select').addEventListener("change", function(){
    monthlyData(document.querySelector('.select').value, document.querySelector('.slider').value);
    // call display on the map
    
});
    
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//range slider input
document.querySelector('.slider').addEventListener("change", function(){
    const value = document.querySelector('.slider').value;
    document.querySelector('.monthDisplay').innerText = months[value - 1];

    const monthly = monthlyData(document.querySelector('.select').value, value);
    // call display on the map
    displayOnMap(monthly);
});



  
   


