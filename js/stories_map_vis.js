class StoriesMapVis {
    constructor(_parentElement, _data, geoData) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = [];
        this.storiesData = _data[2];
        this.hectareData = _data[1];
        this.geoData = geoData;

        this.wrangleData();
    }

    wrangleData(storyMapFilters) {
        let vis = this;

        // create copy of stories data
        vis.displayData = vis.storiesData;

        // check if filter has been requested
        if(storyMapFilters && storyMapFilters.length > 0){
            vis.filtered = true;
            vis.displayData = vis.displayData.filter(row => {
                // if row meets any of the filter criteria, keep row
                for(let i = 0; i<storyMapFilters.length; i++){
                    let filter = storyMapFilters[i]
                    if(row[filter]){ return true }
                }
                return false
            })
        }

        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

        // create d3 selection of stories map vis
        vis.stories = d3.select('#stories_map_vis')
            .selectAll("div")
            .data(vis.displayData)

        // append divs for each story
        vis.stories
            .enter()
            .append("div")
            .attr("class","storyBox")
            .merge(vis.stories)
            .on("mouseover", function(event,d){
                // find geojson feature that matches story's hectare ID
                vis.geoData.features.some((element) => {
                    if(d.Hectare === element.properties["Hectare ID"]){
                        // draw hectare when found
                        drawHectareLink(element)
                        // and stop looping
                        return true
                    }
                })

                // add border to story div, signaling hover
                d3.select(this)
                    .style("border", "2px solid black")
            })
            .on("mouseout", function(event,d){
                // clear hectares
                clearHectareLink()
                // undo border when done hovering
                d3.select(this)
                    .style("border","none")
            })
            .text(d => d["Note Squirrel & Park Stories"])

        // remove divs after filtering
        vis.stories.exit().remove()

        // re-render horizontal carousel with new data
        sliderInit(vis.filtered)

    }
}
