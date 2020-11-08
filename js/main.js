/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & mini datasets


// Functions to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%m%d%Y");
let dateParser = d3.timeParse("%m%d%Y");

// load data using promises
let promises = [
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Squirrel_Data.csv"),
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Hectare_Data.csv"),
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Stories.csv")
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

    let squirrelData = dataArray[0]
    let hectareData = dataArray[1]
    let storiesData = dataArray[2]

    // DATA PROCESSING -------------------------------------------------------------------------
    // console.log("squirrel data", squirrelData)
    squirrelData.map(d=>{
        d.X = +d.X
        d.Y = +d.Y
        d.Date = dateParser(d.Date)
        d["Hectare Squirrel Number"] = +d["Hectare Squirrel Number"]

        // Interactions with humans
        d.Approaches = eval(d.Approaches)
        d.Indifferent = eval(d.Indifferent)
        d["Runs from"] = eval(d["Runs from"])
        d["Human Interactions"] = d3.range(0, 4).map(function(){
            return 0;
        });
        let interactions_list = ["Approaches", "Indifferent", "Runs from", "Other Interactions"]
        d["Human Interactions"].forEach((a, i)=>{
            if(d[interactions_list[i]]){
                d["Human Interactions"][i] = 1
            }
        })

        // Squirrel Activites
        d.Running = eval(d.Running)
        d.Chasing = eval(d.Chasing)
        d.Climbing = eval(d.Climbing)
        d.Eating = eval(d.Eating)
        d.Foraging = eval(d.Foraging)
        // Create an array of values for activity 0 - 4
        d["Activities"] = d3.range(0, 6).map(function(){
            return 0;
        });
        let activities_list = ["Running", "Chasing", "Climbing", "Eating", "Foraging", "Other Activities"]
        d["Activities"].forEach((a, i)=>{
            //console.log("in data processing", a, i)
            if(d[activities_list[i]]) {
                d["Activities"][i] = 1
            }
        })

        d.Kuks = eval(d.Kuks)
        d.Moans = eval(d.Moans)
        d.Quaas = eval(d.Quaas)
        d["Sounds"] = d3.range(0, 3).map(function(){
            return 0;
        });
        let sounds_list = ["Kuks", "Moans", "Quaas"]
        d["Sounds"].forEach((a, i)=>{
            //console.log("in data processing", a, i)
            if(d[activities_list[i]]) {
                d["Sounds"][i] = 1
            }
        })

        // Process Lat/Long - 7 is the index the numbers start
        d["Latitude"] = +d["Lat/Long"].substring(7, d["Lat/Long"].indexOf(" ", 7))
        d["Longitude"] = +d["Lat/Long"].substring(d["Lat/Long"].indexOf(" ", 7)+1, d["Lat/Long"].length-1)

        d["Tail flags"] = eval(d["Tail flags"])
        d["Tail twitches"] = eval(d["Tail twitches"])
        return d;
    })

    // console.log(hectareData)
    hectareData.map(d=>{
        d["Anonymized Sighter"] = +d["Anonymized Sighter"]
        d.Date = dateParser(d.Date)
        d["Number of Squirrels"] = +d["Number of Squirrels"]
        d["Number of sighters"] = +d["Number of sighters"]
        d["Total Time of Sighting"] = +d["Total Time of Sighting"]
        return d
    })

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

