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
    let hookVis = new HookVis("hook_vis", dataArray);
    let bubbleVis = new BubbleVis("bubble_vis", dataArray);
    let sankeyVis = new SankeyVis("sankey_vis", dataArray);
    let squirrelMapVis = new SquirrelMapVis("squirrel_map_vis", dataArray);
    let storiesVis = new StoriesVis("stories_vis", dataArray);
    let timelineBrushVis = new TimelineBrushVis("timeline_brush_vis", dataArray);
    let walkMapVis = new WalkMapVis("walk_map_vis", dataArray);


    // when 'selectionChanged' is triggered, specified function is called
    // $(MyEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
         // ageVis.onSelectionChange(rangeStart, rangeEnd);
    // });

}

