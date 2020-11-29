class BarVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.categories = {
            "Human Interactions" : ["Approaches", "Indifferent", "Runs from", "Other Interactions"],
            "Activities" : ["Running", "Chasing", "Climbing", "Eating", "Foraging", "Other Activities"],
            "Sounds" : ["Kuks", "Moans", "Quaas"],
            "Tail movements": ["Tail flags", "Tail twitches"],
            "Fur color": ["Gray", "Cinnamon", "Black"]
        }

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 100, left: 40 };
            //TODO - resize the page container so it fits the all graphs in one view
        // at that point fix the bottom margin

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")

        // SCALES AND AXES
        // A scale that gives a X target position for each group
        vis.x = d3.scaleBand() //or scalepoint?
            //.domain([1, 2, 3])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([0, vis.height])

        // A color scale
        vis.color = d3.scaleLinear()
            .range(["#e3fafa", "#0b8fba"])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis bar-axis")

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis bar-axis")


        // Tooltips append placeholder div
        vis.tooltip = d3.select("body").append("div")//`#${(vis.parentElement)}`).append('div')
            .attr('class', "bar-tooltip")

        // Group to hold the circles later
        // vis.circlesGroup = vis.svg.append("g")
        //     .attr("class", "circles-group")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        console.log("inside bar vis, data:", vis.data)

        // here, what we need is to know the total number of each category in the
        // selected category - probably the easiest way is to group by that category
        // and then transform the rest into counts

        vis.category = bubbleCategory
        console.log("NEW CATEGORY SELECTED", vis.category)
        vis.displayData = []

        // Filter data to only include points with observation for this category
        vis.displayData = vis.data.filter(d=> d[vis.category].indexOf(1) != -1)

        let countsByCategory = Array.from(d3.group(vis.displayData, d=>vis.categories[vis.category][d[bubbleCategory].indexOf(1)]), ([key, value]) => ({key, value: value.length}))
        // countsByCategory.forEach(())
        console.log(countsByCategory)
        vis.displayData = countsByCategory
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //update domains
        vis.x.domain(vis.categories[vis.category])
        vis.color.domain(d3.extent(vis.displayData, d=>d.value))
        vis.y.domain([d3.max(vis.displayData, d=> d.value), 0])
        vis.xAxisGroup.call(vis.xAxis)
            .attr("transform", `translate(0, ${vis.height})`)
        vis.yAxisGroup.call(vis.yAxis)

        vis.rectangles = vis.svg.selectAll("rect").data(vis.displayData)
        vis.rectangles.exit().remove()
        vis.rectangles.enter().append("rect")
            .attr("class", "bar")
            .merge(vis.rectangles)
            .attr("x", (d, i)=> vis.x(d.key))
            .attr("width", vis.x.bandwidth())
            // .on("mouseover", function(event, d){
            //     console.log(event, d)
            //     d3.select(this)
            //         .attr('stroke-width', '2px')
            //         .attr('stroke', 'black')
            //         .attr('fill', 'rgba(173,222,255,0.62)')
            //     vis.tooltip
            //         .style("opacity", 1)
            //         .style("left", event.pageX  + "px")
            //         .style("top", event.pageY + "px")
            //         .html(`
            //                  <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
            //                      <h3> State: ${d.state}</h3>
            //                      <h4> Cases: ${d.absCases}</h4>
            //                      <h4>Deaths: ${d.absDeaths}</h4>
            //                      <h4>Relative Cases: ${d.relCases}</h4>
            //                      <h4>Relative Deaths: ${d.relDeaths}</h4>
            //                  </div>`);
            //
            // })
            // .on('mouseout', function(event, d){
            //     d3.select(this)
            //         .attr('stroke-width', '0px')
            //         .attr("fill", d=>vis.colorScale(d[selectedCategory]))
            //
            //     vis.tooltip
            //         .style("opacity", 0)
            //         .style("left", 0)
            //         .style("top", 0)
            //         .html(``);
            // })
            .transition()
            .duration(800)
            .attr("y", d=>vis.y(d.value))
            .attr("height", d=> vis.height-vis.y(d.value))
                // going from less to more categories has awkward transition
            .attr("fill", d=>vis.color(d.value))


    }

}
