/*
 *  SentimentVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with ????
 */

class SentimentVis {
    constructor(_parentElement, _storiesData) {
        this.parentElement = _parentElement;
        this.data = _storiesData;
        //this.commonWords = _commonWords;

        let category_list = ["Accidental Poems", "Census Takers Recognized", "Dogs",
            "Park Experience or Census Taker Story", "Squirrel Experience or Squirrel Story",
            "Squirrels Acting Odd", "Other Animals", "Other"]

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")



        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = vis.data;
        console.log("inside sentiment vis", vis.data)
        let storyDataByCategory = Array.from(d3.group(vis.displayData, d=>d["Story Topic"]), ([key, value]) => ({key, value}))
        console.log(storyDataByCategory)
        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

    }
}
