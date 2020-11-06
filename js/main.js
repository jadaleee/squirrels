/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & mini datasets


// Functions to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// load data using promises
let promises = [
    // put csv or json here
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    // (3) Create event handler
    let MyEventHandler = {};


    // Create Visualization instances
    // let countVis = new CountVis("countvis", allData, MyEventHandler);

    // when 'selectionChanged' is triggered, specified function is called
    // $(MyEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
         // ageVis.onSelectionChange(rangeStart, rangeEnd);
    // });

}

