
//using d3, canadian map main interaction logic
const canvas = d3.select('body')
    .append('svg')
    .attr('width', '750')
    .attr('height', '610')
    .style('background-color', '#eeeeee')
    .attr('class', 'canada-map')
    .style('display', 'grid')
    
const canvas2 = d3.select('body')
    .append('svg')
    .attr('width', '450')
    .attr('height', '610')
    .style('background-color', '#999999')
    .attr('class', 'bar-chart')
    .style('display', 'grid')

const canvas3 = d3.select('body')
    .append('svg')
    .attr('width', '250')
    .attr('height', '310')
    .style('background-color', '#777777')
    .attr('class', 'bar-chart')
    .style('display', 'grid')

d3.json("canadaProvinces.json").then((data) => {
    const group = canvas.selectAll('g')
        .data(data.features)
        .enter()
        .append('g')
        .attr('class', 'provinces')

    const projection = d3.geoMercator().scale([450]).translate([1150, 930]);
    const path = d3.geoPath().projection(projection);

    const areas = group.append("path")
        .attr('d', path)
        .attr('class', 'area')
        .attr('fill', 'steelblue')
        .append('title')
        .text((d) => { return d.properties.PRENAME; });

    document.querySelectorAll('.area').forEach(province => { province.addEventListener('mouseover', (e) => {
        const name = "hello c'mon"
        const fullMessage = name.concat(" :thousand");
        const domEle = document.getElementById("hover-tt");
        domEle.innerHTML = fullMessage;
        domEle.style.opacity = 1;
    })});

    group.append('text')
        .attr('x', (data) => { return path.centroid(data)[0]; })
        .attr('y', (data) => { return path.centroid(data)[1]; })
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text((data) => { return data.properties.PRENAME; })



    document.getElementsByClassName('canada-map')[0].addEventListener("mouseleave", e => {
        document.getElementById("hover-tt").innerHTML = "";
        document.getElementById("hover-tt").style.opacity = 0;
    });


    // document.getElementsByClassName('area').addEventListener("mouseover", e => {
    //       const name = e.target.__data__.properties.NAME;
    //       const fullMessage = name.concat(": ", Number(currentYearDataset[name.concat(" : all fuels (utility-scale)")]).toLocaleString(), " gigawatthours (GWh)");
    //       const domEle = document.getElementById("hover-tooltip");
    //       domEle.innerHTML = fullMessage;
    //       domEle.style.opacity = 1;
    //   });

    //     usMap.addEventListener("click", e => {
    //         const name = e.target.__data__.properties.NAME;
    //         const usDataButton = document.getElementById("us-data");

    //         renderChart("update", fullDataset[currentYear][name]);
    //         stateYearlyChart("update", name);
    //         usDataButton.style.opacity = 1;
    //         usDataButton.style.visibility = "visible";
    //     })

    // d3.select(window).on('resize', () => { return canvas.resize()})
});

// csv data 
fetch('travel_to_canada_province.csv')
    .then(response => response.text())
    .then((data) => {
        const arr = parseCSV(data);
        newArr = [];
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
            return newArr;
        })
        // console.log(newArr);
    });



