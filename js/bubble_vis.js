/*
 *  BubbleVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with ????
 */

class BubbleVis {
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

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")

        // SCALES AND AXES
        vis.x = d3.scaleBand()
            .range([0, vis.width])

        // A color scale
        vis.color = d3.scaleOrdinal()
            //.domain([1, 2, 3])
            .range([ "#FF781F", "#FCCA46", "#BFDBF7", "#233D4D"])

        vis.xAxis = d3.axisTop()
            .scale(vis.x)
            .tickSize(0)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "axis x-axis bubble-axis")

        // Legend
        vis.categories["Human Interactions"].forEach((cat, i)=>{
            vis.svg.append("rect")
                .attr("x", i*100 + 10)
                .attr("y", -10)
                .attr("width", 15)
                .attr("height", 15)
                .attr("stroke", "none")
                .attr("fill", vis.color(cat))
            vis.svg.append("text")
                .attr("class", "standard-text")
                .attr("x", i*100 + 30)
                .attr("y", 0)
                .text(cat)
        })
        // vis.legend = d3.axisBottom()
        //     .scale(vis.color)
        //     .tickSize(0)
        //
        // vis.legendGroup = vis.svg.append("g")
        //     .attr("class", "bubble-axis")

        // Tooltips append placeholder div
        vis.tooltip = d3.select("body").append("div")//`#${(vis.parentElement)}`).append('div')
            .attr('class', "bubble-tooltip")

        // Group to hold the circles later
        vis.circlesGroup = vis.svg.append("g")
            .attr("class", "circles-group")
            .attr("transform", "translate(0, 60)")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        // console.log("inside bubble vis, data:", vis.data)

        vis.category = bubbleCategory
        vis.displayData = []
        vis.data.forEach((squirrel, i)=>{
            //if(squirrel[vis.category].indexOf(1) != -1
            // console.log(squirrel, squirrel["Unique Squirrel ID"], squirrel[vis.category])
            if(!Object.keys(vis.categories).slice(0, 3).map(d=> squirrel[d].indexOf(1)).includes(-1))
                vis.displayData.push({
                    name: squirrel["Unique Squirrel ID"],
                    group: vis.categories[vis.category][squirrel[vis.category].indexOf(1)],
                    // hardcode in categories
                    "Human Interactions": vis.categories["Human Interactions"][squirrel["Human Interactions"].indexOf(1)],
                    "Activities": vis.categories["Activities"][squirrel["Activities"].indexOf(1)],
                    "Sounds": vis.categories["Sounds"][squirrel["Sounds"].indexOf(1)],
                    color: vis.color(vis.categories["Human Interactions"][squirrel["Human Interactions"].indexOf(1)])

                })
        })

        // don't need this bc there's only 90 anyway
       // console.log("is this len < 90?", vis.displayData)
        vis.displayData = vis.displayData.slice(0, 100);

        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

        //update domains
        vis.x.domain(vis.categories[vis.category])
        vis.color.domain(vis.categories["Human Interactions"]) //all colors based on human interactions

        vis.xAxisGroup.call(vis.xAxis)
            .attr("transform", `translate( 0, 40)`)

        // Initialize a forceX for each category
        // var forceXhuman = d3.forceX(d=>vis.humanInteractionsX(d))
        // var forceXactivity = d3.forceX(d=>vis.activitiesX(d))
        // var forceXsound = d3.forceX(d=>vis.soundsX(d))

        vis.circles = vis.svg.select(".circles-group").selectAll("circle")
            .data(vis.displayData.filter(d=>d.group), d=>d.name)
        //
        // vis.circles.exit().remove()
        vis.circles.exit().remove()

        vis.circlesEnter = vis.circles
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", vis.width / 2)
            .attr("cy", vis.height / 2)
            .style("fill", function(d){ return d.color})

        // .call(d3.drag() // call specific function when circle is dragged
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended))

        vis.circles.merge(vis.circlesEnter)
            // .attr("cx", vis.width / 2)
            // .attr("cy", vis.height / 2)
            .attr("stroke", "black")
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            .on("mouseover", function(event, d){
                //console.log(event, d)
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    //.style("background", "rgba(179, 107, 0, 0.5)")
                    .style("opacity", 1)
                    .style("left", event.pageX  + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                             <div>
                                 <h4> ${vis.category}: ${d.group}</h4>  
                                 ${vis.category=="Human Interactions"?"":"<h4> Human Interactions: "+ d["Human Interactions"] +"</h4>"}

                             </div>`);

            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d=>d.color)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        vis.circlesEnter.exit().remove()

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        // Features of the forces applied to the nodes:
        //if(!vis.simulation) {
        vis.simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(0.5).x(function (d) {
                let subtract = vis.width < 380 ? vis.margin.left/2 : vis.margin.left
                return vis.x(d.group) + vis.width / (vis.x.domain().length+1) - subtract
            }))
            .force("y", d3.forceY().strength(0.1).y(vis.height / 2))
            //.force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.2)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(0.5).radius(10).iterations(1)) // Force that avoids circle overlapping
            .on("tick", function(d){
                vis.circles.merge(vis.circlesEnter)
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
            });
        // vis.circles = vis.svg.select(".circles-group").selectAll("circle")
        //}

        vis.simulation
            .nodes(vis.displayData)

        vis.simulation.force("x").initialize(vis.displayData)
        vis.simulation
            .alpha(0.5)
            //.alphaTarget(0.3)
            .restart();
    }
    // What happens when a circle is dragged?
    // dragstarted(d) {
    //     if (!d3.event.active) simulation.alphaTarget(.03).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    // }
    // dragged(d) {
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    // }
    // dragended(d) {
    //     if (!d3.event.active) simulation.alphaTarget(.03);
    //     d.fx = null;
    //     d.fy = null;
    // }
}
