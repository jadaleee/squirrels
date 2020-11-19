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
                        color: '#3b2929',
                        weight: 4
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
            vis.walkLatLngs = layer.getLatLngs()
            console.log(vis.walkLatLngs)

            // Add layer to map
            vis.drawnItems.addLayer(layer);
        });


        // Add empty layer groups for the squirrel markers
        // vis.squirrelMarkers = L.layerGroup().addTo(vis.map);

        // Add empty layer groups for the hectare markers
        vis.geoHectareMarkers = L.geoJSON().addTo(vis.map);

        vis.wrangleData();
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
