class SquirrelMapVis {
    constructor(_parentElement, _data, geoData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.squirrelData = _data[0];
        this.hectareData = _data[1];
        this.displaySquirrelData = [];
        this.geoData = geoData;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // define map at center of Central Park
        vis.map = L.map('squirrel_map_vis',{
            zoomSnap: 0.25
        }).setView([40.7812,-73.9665],13.5);

        // add OpenStreetMap Mapnik
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // Add empty layer groups for the squirrel markers
        vis.squirrelMarkers = L.layerGroup().addTo(vis.map);

        // Add empty layer groups for the hectare markers
        vis.geoHectareMarkers = L.geoJSON().addTo(vis.map);

        vis.wrangleData();
    }

    wrangleData(furFilters, reactionFilters, locationFilters, timeFilters) {
        let vis = this;

        let filteredData = [];

        // Filter: fur color
        if(furFilters && furFilters.length > 0){
            // for every fur filter, add rows that meet criteria
            for(let i = 0; i < furFilters.length; i++){
                vis.squirrelData.forEach( row => {
                    if(row["Primary Fur Color"] === furFilters[i]){
                        filteredData.push(row)
                    }
                })
            }
        }

        // Filter: reaction to humans
        if(reactionFilters && reactionFilters.length > 0){
            // check if data has been filtered
            if(filteredData.length > 0){
                    // if so, need to filter the filteredData
                    filteredData = filteredData.filter( row => {
                        // if row meets any of the filter criteria, keep row
                        for(let i = 0; i < reactionFilters.length; i++) {
                            let reaction = reactionFilters[i]
                            if(row[reaction]){
                                return true
                            }
                        }
                        return false
                    })
            }
            else{
                // data has not been filtered = add to filteredData array
                for(let i = 0; i < reactionFilters.length; i++){
                    let reaction = reactionFilters[i]
                    vis.squirrelData.forEach( row => {
                        if(row[reaction]){
                            filteredData.push(row)
                        }
                    })
                }
            }
        }

        // Filter: squirrel location relative to ground
        if(locationFilters && locationFilters.length > 0){
            // check if data has been filtered
            if(filteredData.length > 0) {
                // if so, need to filter the filteredData
                filteredData = filteredData.filter(row => {
                    // if row meets any of the filter criteria, keep row
                    for (let i = 0; i < locationFilters.length; i++) {
                        if (row.Location === locationFilters[i]) {
                            return true
                        }
                    }
                    return false
                })

            }
            else{
                // data has not been filtered = add to filteredData array
                for(let i = 0; i < locationFilters.length; i++){
                    vis.squirrelData.forEach( row => {
                        if(row.Location === locationFilters[i]){
                            filteredData.push(row)
                        }
                    })
                }
            }
        }

        // Filter: Time of Day
        if(timeFilters && timeFilters.length > 0){
            // check if data has been filtered
            if(filteredData.length > 0){
                // if so, need to filter the filteredData
                filteredData = filteredData.filter( row => {
                    // if row meets any of the filter criteria, keep row
                    for(let i = 0; i < timeFilters.length; i++) {
                        if(row.Shift === timeFilters[i]){
                            return true
                        }
                    }
                    return false
                })
            }
            else{
                // data has not been filtered = add to filteredData array
                for(let i = 0; i < timeFilters.length; i++){
                    vis.squirrelData.forEach( row => {
                        if(row.Shift === timeFilters[i]){
                            filteredData.push(row)
                        }
                    })
                }
            }
        }

        // show all squirrel data if no filters are applied
        filteredData.length > 0 ? vis.displaySquirrelData = filteredData : vis.displaySquirrelData = vis.squirrelData

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

                // extract fur color
                let primaryFurColor = element["Primary Fur Color"]

                // set description for squirrel reaction to human
                let humanReaction = ""
                if (element.Approaches){
                    humanReaction = "Approaches"
                }
                else if (element.Indifferent) {
                    humanReaction = "Indifferent"
                }
                else if (element["Runs from"]){
                    humanReaction = "Runs From"
                }

                // set description for squirrel sighting time
                let shiftTime = ""
                element.Shift === "AM" ? shiftTime = "Morning" : shiftTime = "Afternoon"

                // define popupContent with element-specific text
                let popupContent = "<div class=marker> " +
                    "<strong> Primary Fur Color: </strong>"  + primaryFurColor +
                    "<br/> <strong> Reaction to Humans: </strong>" + humanReaction +
                    "<br/> <strong> Time of Sighting: </strong>" + shiftTime +
                    "<br/> <strong> Location: </strong>" + element.Location +
                    "</div>"

                // set cinnamon to brown for color use in marker
                if(primaryFurColor === "Cinnamon"){
                    primaryFurColor = "Brown"
                }

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

    drawHectare(element){
        let vis = this;

        // function to bind pop up to each GEOJson hectare
        function onEachHectare(feature, layer){
            layer.bindPopup("Hectare ID: " + feature.properties["Hectare ID"])
        }

        // draw each GEOJson element aka hectare
        L.geoJson(element, {
            color: "green",
            weight: 3,
            fillOpacity: 0.7,
            onEachFeature: onEachHectare
        }).addTo(vis.geoHectareMarkers)
    }

    clearHectare(){
        let vis = this;

        // clear markers from previous rendering of layers
        vis.geoHectareMarkers.clearLayers()
    }
}
