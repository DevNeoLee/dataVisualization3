// csv data 
function travelData() { 
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
      
    })};

 