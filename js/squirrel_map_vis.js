class SquirrelMapVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.squirrelData = _data[0];
        this.hectareData = _data[1];
        this.displaySquirrelData = [];

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };

        vis.width = $("#" + vis.parentElement).width()  - vis.margin.left - vis.margin.right,
            vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")

        // define map at center of Central Park
        vis.map = L.map('squirrel_map_vis').setView([40.7812,-73.9665], 14);

        // add OpenStreetMap Mapnik
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // define path to images
        L.Icon.Default.imagePath = 'images/';

        // Add empty layer groups for the markers / map objects
        vis.squirrelMarkers = L.layerGroup().addTo(vis.map);

        vis.wrangleData();
    }

    wrangleData(furFilters, reactionFilters, locationFilters, timeFilters) {
        let vis = this;

        let filteredData = [];

        // Filter: fur color
        if(furFilters){
            for(let i = 0; i < furFilters.length; i++){
                vis.squirrelData.forEach( row => {
                    if(row["Primary Fur Color"] === furFilters[i]){
                        filteredData.push(row)
                    }
                })
            }
            console.log(filteredData)
        }

        // Filter: reaction to humans
        if(reactionFilters && reactionFilters.length > 0){
            if(filteredData.length > 0){

                    filteredData = filteredData.filter( row => {
                        for(let i = 0; i < reactionFilters.length; i++) {
                            let reaction = reactionFilters[i]
                            if(row[reaction]){
                                return true
                            }
                        }
                        return false
                    })

                console.log(filteredData)
            }
            else{
                for(let i = 0; i < reactionFilters.length; i++){
                    let reaction = reactionFilters[i]
                    vis.squirrelData.forEach( row => {
                        if(row[reaction]){
                            filteredData.push(row)
                        }
                    })
                }
                console.log(filteredData)
            }
        }

        // Filter: squirrel location relative to ground

        // Filter: Time of Day

        if(filteredData.length > 0){
            vis.displaySquirrelData = filteredData
        }
        else{
            vis.displaySquirrelData = vis.squirrelData
        }
        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

        // clear markers from previous rendering of layers
        vis.squirrelMarkers.clearLayers()

        // iterate through squirrels array
        vis.displaySquirrelData.forEach( function(element){
                // extract coordinates for each squirrel sighting; census takers had flipped Longitude and Latitude
                let coord = [element.Longitude, element.Latitude]

                // extract fur color, set cinnamon to brown for marker use later
                let primaryFurColor = element["Primary Fur Color"]
                if(primaryFurColor === "Cinnamon"){
                    primaryFurColor = "Brown"
                }

                // set description for squirrel reaction to human
                let humanReaction = ""
                if (element.Approaches){
                    humanReaction = "Approaches"
                }
                else if (element.Indifferent) {
                    humanReaction = "Indifferent"
                }
                else if (element["Runs From"]){
                    humanReaction = "Runs From"
                }

                // define popupContent with element-specific text
                let popupContent = "<strong> Squirrel Sighting </strong>" +
                    "<br/> Location: " + element.Location +
                    "<br/> Primary Fur Color: "  + primaryFurColor +
                    "<br/> Time of Sighting: " + element.Shift +
                    "<br/> Reaction to Humans: " + humanReaction

            // console.log(element)
                // create marker
                let marker =  L.circle(coord, 2, {
                    color: primaryFurColor,
                    fillColor: '#ddd',
                    fillOpacity: 0.5
                }).bindPopup(popupContent)

                // Add marker to layer group
                vis.squirrelMarkers.addLayer(marker);
            }
        )
    }
}
