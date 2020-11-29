/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & mini datasets


// Functions to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%m%d%Y");
let dateParser = d3.timeParse("%m%d%Y");

let squirrelMapVis,
    storiesMapVis,
    walkMapVis,
    bubbleVis,
    barVis,
    storiesVis,
    sentimentVis;

// load data using promises
let promises = [
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Squirrel_Data.csv"),
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Hectare_Data.csv"),
    d3.csv("data/2018_Central_Park_Squirrel_Census_-_Stories_Sentiment.csv"),
    d3.csv("data/common_words.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// Sentiment Vis: set up onchange for the story vis select
let storyCategory = $('#story_select').val();

d3.select("#story_select").on("change", categoryStoryChange)
function categoryStoryChange() {
    storyCategory = $('#story_select').val();
    sentimentVis.wrangleData(); //was update vis but i think we actually need to re-wrangle data
}

// Bubble Vis: set up onchange for the story vis select
let bubbleCategory = $('#bubble_select').val();

d3.select("#bubble_select").on("change", categoryBubbleChange)
function categoryBubbleChange() {
    bubbleCategory = $('#bubble_select').val();
    bubbleVis.wrangleData();
    barVis.wrangleData(); //was update vis but i think we actually need to re-wrangle data
}

// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    // (3) Create event handler
    let MyEventHandler = {};

    let squirrelData = dataArray[0]
    let hectareData = dataArray[1]
    let storiesData = dataArray[2]
    let commonWordsData = dataArray[3]

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
            if(d[sounds_list[i]]) {
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

    storiesData.map(d=>{
        d.Sentiment = +d.Sentiment;
        d.Date = dateParser(d.Date);
        d.Length = +d.Length;
        d["Squirrels"] = eval(d["Squirrels"]) //this is one v rest but we could also try sq vs other animals
        d["Other Animals"] = eval(d["Other Animals"])
        d["Story Topic: Accidental Poems"] = eval(d["Story Topic: Accidental Poems"])
        d["Story Topic: Census Takers Recognized"] = eval(d["Story Topic: Census Takers Recognized"])
        d["Story Topic: Dogs"] = eval(d["Story Topic: Dogs"])
        d["Story Topic: Other Animals"] = eval(d["Story Topic: Other Animals"])
        d["Story Topic: Other"] = d["Story Topic: Other"] == 0? 0:1
        d["Story Topic: Park Experience or Census Taker Story"] = eval(d["Story Topic: Park Experience or Census Taker Story"])
        d["Story Topic: Squirrel Experience or Squirrel Story"] = eval(d["Story Topic: Squirrel Experience or Squirrel Story"])
        d["Story Topic: Squirrels Acting Odd"] = eval(d["Story Topic: Squirrels Acting Odd"])

        d["Story Topic"] = d3.range(0, 8).map(function(){
            return 0;
        });
        d["Story Topic (String)"] = ""
        let category_list = ["Story Topic: Accidental Poems", "Story Topic: Census Takers Recognized", "Story Topic: Dogs",
            "Story Topic: Other Animals", "Story Topic: Other",
            "Story Topic: Park Experience or Census Taker Story", "Story Topic: Squirrel Experience or Squirrel Story",
            "Story Topic: Squirrels Acting Odd"]
        d["Story Topic"].forEach((a, i)=>{
            //console.log("in data processing", a, i)
            if(d[category_list[i]]) {
                d["Story Topic"][i] = 1
                d["Story Topic (String)"] = category_list[i]
            }
        })
    })

    // GROUP SQUIRREL SIGHTINGS BY HECTARE
    // NOTE TO SELF: squirrelDataByHectare length < total # hectares bc some hectares are in lakes
    let squirrelDataByHectare = Array.from(
        d3.group(squirrelData, d=>d.Hectare),
        ([key, value]) => ({key, value})
    )

    squirrelDataByHectare.forEach((hectare, i)=>{
        // add key-value pair: number of squirrels in hectare
        hectare.squirrelsInHectare = hectare.value.length

        // set default false for squirrel approach
        hectare.squirrelWouldApproach = false;

        // if squirrel has approached human in the hectare, change to true
        hectare.value.some( (squirrel) => {
            if(squirrel["Approaches"]){
                hectare.squirrelWouldApproach = true;
                return true
            }
        })
    })

    // Create Visualization instances that don't require GEOJson
    bubbleVis = new BubbleVis("bubble_vis", squirrelData);
    barVis = new BarVis("bar_vis", squirrelData);
    storiesVis = new StoriesVis("stories_vis", dataArray[2], dataArray[3]);
    sentimentVis = new SentimentVis("sentiment_vis", dataArray[2])

    // load GEOJson data for hectare grid
    d3.json("data/2018_Central_Park_Squirrel_Census_-_Hectare_Grid.geojson")
        .then(function(geoData) {
            // letters for hectare id (following Squirrel Census naming convention)
            let letters = ["A","B","C","D","E","F","G","H","I"]

            let idLetterLoop = 0;
            let idNumberLoop = 42;

            // iterate over features
            geoData.features.forEach(function (element) {
                if(idNumberLoop<10){
                    // add hectare id to each geojson feature WITH 0
                    element.properties["Hectare ID"] = "0" + idNumberLoop.toString() + letters[idLetterLoop]
                }
                else{
                    // add hectare id to each geojson feature
                    element.properties["Hectare ID"] = idNumberLoop.toString() + letters[idLetterLoop]
                }

                // after nine elements, add 1 to the id and start over from "I" (following Squirrel Census Hectare ID convention)
                idLetterLoop++;
                if(idLetterLoop === 9){
                    idLetterLoop = 0;
                    idNumberLoop--;
                }
            })

            // set to random number to allow comparison in forEach
            let squirrelMax = 10;
            let squirrelMin = 10;

            // add num of squirrelsInHectare to geoData properties for later use in heatmap opacity scale
            geoData.features.forEach( (feature) => {
                squirrelDataByHectare.some((hectare) => {
                    if(feature.properties["Hectare ID"] === hectare.key){
                        let squirrelsInHectare = hectare.squirrelsInHectare
                        feature.properties.squirrelsInHectare = squirrelsInHectare

                        // find minimum number of squirrels in a hectare
                        if(squirrelsInHectare < squirrelMin){
                            squirrelMin = squirrelsInHectare
                        }

                        // find maximum number of squirrels in a hectare
                        if(squirrelsInHectare > squirrelMax){
                            squirrelMax = squirrelsInHectare
                        }
                        return true
                    }
                })

            })

            // Create visualizations with geojson data loaded
            storiesMapVis = new StoriesMapVis("stories_map_vis", dataArray, geoData);
            squirrelMapVis = new SquirrelMapVis("squirrel_map_vis", dataArray, geoData);
            walkMapVis = new WalkMapVis("walk_map_vis", dataArray, geoData, squirrelDataByHectare, squirrelMin, squirrelMax);
        })
}

// Rising Insights - Filters for squirrel sightings map
let furFilters = [];
let reactionFilters = [];
let timeFilters = [];
let locationFilters = [];

function mapFilterClicked(input){
    // get selected filter from html
    let selectedFilter = $(input).val();
    let className = $(input).attr('class');

    if(className === "fur"){
        let index = furFilters.indexOf(selectedFilter)
        // if filter is on list ? take off : add to filter list
        index > -1 ? furFilters.splice(index, 1) : furFilters.push(selectedFilter)
    }

    else if(className === "reaction"){
        let index = reactionFilters.indexOf(selectedFilter)
        // if filter is on list ? take off : add to filter list
        index > -1 ? reactionFilters.splice(index, 1) : reactionFilters.push(selectedFilter)
    }

    else if(className === "time"){
        let index = timeFilters.indexOf(selectedFilter)
        // if filter is on list ? take off : add to filter list
        index > -1 ? timeFilters.splice(index, 1) : timeFilters.push(selectedFilter)
    }

    else if(className === "location"){
        let index = locationFilters.indexOf(selectedFilter)
        // if filter is on list ? take off : add to filter list
        index > -1 ? locationFilters.splice(index, 1) : locationFilters.push(selectedFilter)
    }

   squirrelMapVis.wrangleData(furFilters, reactionFilters, locationFilters, timeFilters)
}

// Rising Insights - Filters for stories
let storyMapFilters = [];

function storyMapFilterClicked(input) {
    let selectedFilter = $(input).val();

    let index = storyMapFilters.indexOf(selectedFilter)
    // if filter is on list ? take off : add to filter list
    index > -1 ? storyMapFilters.splice(index,1) : storyMapFilters.push(selectedFilter)

    storiesMapVis.wrangleData(storyMapFilters)
}

// Rising Insights -- function to create and update horizontal carousel for stories
function sliderInit(filtered){
    if(filtered){
        $('.stories-carousel').slick("unslick")
    }

    $('.stories-carousel').slick({
        dots: false,
        infinite: false,
        speed: 200,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
    })
};

// Rising Insights -- call function to draw hectare on leaflet map
function drawHectareLink(element){
    squirrelMapVis.drawHectare(element)
}

function clearHectareLink(){
    squirrelMapVis.clearHectare()
}

// Call to Action -- call function to draw hectare heat map
function heatMap(input) {
    if(input.checked){
        walkMapVis.initHeatMap()
    }
    else{
        walkMapVis.clearHeatMap()
    }
}
