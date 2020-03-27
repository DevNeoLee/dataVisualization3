
// csv data 
    const travelData = () => { 
        const newArr = [];
        fetch('travel_to_canada_province.csv')
        .then(response => response.text())
        .then((data) => {
            const arr = parseCSV(data);
            
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
            
            })

        })
        return newArr;
    };
console.log(travelData());

const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
const months = [1,2,3,4,5,6,7,8,9,10,11,12];

const monthlyDataSet = () => {
    const monthly = {};

    years.forEach((year) => {
        months.forEach((month)=> {
            // console.log("year: " + year + " month: " + month );
            // travelData.
        });
    });
}

monthlyDataSet();

const getTouristPopulation = () => {
    let number = 0;
    
    return number;
}
//three canvas for '.displayContainer' 
const canvas1 = d3.select('.displayContainer')
    .append('svg')
    .attr('width', '750')
    .attr('height', '610')
    .style('background-color', '#eeeeee')
    .attr('class', 'map-chart')
    .style('display', 'grid')
    
const canvas2 = d3.select('.displayContainer')
    .append('svg')
    .attr('width', '450')
    .attr('height', '610')
    .style('background-color', '#999999')
    .attr('class', 'bar-chart')
    .style('display', 'grid')

const canvas3 = d3.select('.displayContainer')
    .append('svg')
    .attr('width', '250')
    .attr('height', '310')
    .style('background-color', '#777777')
    .attr('class', 'line-chart')
    .style('display', 'grid')

//canvas1 elaborating, canadian map
d3.json("canadaProvinces.json").then((data) => {  
    const provinces = canvas1.selectAll('g')
        .data(data.features)
        .enter()
        .append('g')
        .attr('class', 'provinces')

    const projection = d3.geoMercator().scale([450]).translate([1150, 930]);
    const path = d3.geoPath().projection(projection);

    const province = provinces.append("path")
        .attr('d', path)
        .attr('class', 'province')
        .attr('fill', 'steelblue')
        .append('title')
        .text((d) => { return d.properties.PRENAME; });

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

    document.querySelectorAll('.province').forEach(province => {
        province.addEventListener('mouseleave', (e) => {
          
            let tooltip = document.querySelector('.tooltip');
            // tooltip.style.opacity = 1;
            tooltip.innerText = "";
            // const message = `this province had: ${data.features.PRENAME}`;

        })
    });

    provinces.append('text')
        .attr('x', (data) => { return path.centroid(data)[0]; })
        .attr('y', (data) => { return path.centroid(data)[1]; })
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text((data) => { return data.properties.PRENAME; })
});




