class WalkMapVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

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

        // DELETE RECT WHEN READY TO CODE
        vis.svg
            .append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",vis.width)
            .attr("height", vis.height)

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
