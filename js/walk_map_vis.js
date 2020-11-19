class WalkMapVis {
    constructor(_parentElement, _data, _geoData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.geoHectareData = _geoData;
        this.walkLatLngs = [];

        this.initVis();
    }

    initVis() {

        let vis = this;

        // define map at center of Central Park
        vis.map = L.map('walk_map_vis',{
            zoomSnap: 0.25
        }).setView([40.7812,-73.9665],14.25);

        // add OpenStreetMap Mapnik
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

        // FeatureGroup is to store editable layers (layers that are drawn onto map)
        vis.drawnItems = new L.FeatureGroup();
        // add layer to map
        vis.map.addLayer(vis.drawnItems);
        vis.drawControl = new L.Control.Draw({
            // disabling extraneous drawing in order to focus users on their walk path
            draw: {
                polygon: false,
                marker: false,
                circle: false,
                rectangle: false,
                polyline: {
                    shapeOptions: {
                        color: '#281b1b',
                        weight: 4,
                        opacity: 0.9
                    }
                },
            },
            edit: {
                // specifies layer for drawn features
                featureGroup: vis.drawnItems
            }
        });
        // add drawing toolbar to map
        vis.map.addControl(vis.drawControl);


        // when user clicks "Finish" after drawing line, calls following function:
        vis.map.on(L.Draw.Event.CREATED, (event) => {
            let layer = event.layer;
            console.log(event)

            // extract coordinates of path
            let layerCoords = layer.getLatLngs()
            console.log(layerCoords)

            // Add layer to map
            vis.drawnItems.addLayer(layer);

            // CALL INFO BOX UPDATE HERE LATER
            vis.checkHectares(layerCoords)
        });

        // Add empty layer groups for the hectare markers
        vis.geoHectareMarkers = L.geoJSON().addTo(vis.map);

        vis.wrangleData();
    }

    checkHectares(layerCoords){
        let vis = this;

        vis.walkLatLngs = [];

        for(let i = 0; i<layerCoords.length; i = i+2){
            vis.walkLatLngs.push([layerCoords[i].lat, layerCoords[i].lng])
        }
        console.log(vis.walkLatLngs)

        // vis.walkLatLngs.forEach( (coordPair) => {
        //     vis.geoHectareData.features.some( (feature) => {
        //         if(inside.feature(feature,coordPair)){
        //             console.log(feature.properties["Hectare ID"])
        //             return true
        //         }
        //     })
        // })
    }


    wrangleData() {
        let vis = this;

        vis.displayData = vis.data;

        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

    }
}
