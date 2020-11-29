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

        this.category_list = {"Story Topic: Accidental Poems":0, "Story Topic: Census Takers Recognized":1, "Story Topic: Dogs":2,
            "Story Topic: Other Animals":3, "Story Topic: Other": 4,
            "Story Topic: Park Experience or Census Taker Story":5, "Story Topic: Squirrel Experience or Squirrel Story":6,
            "Story Topic: Squirrels Acting Odd":7}
        this.category_names = ["Accidental Poems", "Census Takers Recognized", "Dogs",
            "Other Animals", "Other",
            "Park Experience or Census Taker Story", "Squirrel Experience or Squirrel Story",
            "Squirrels Acting Odd"]
        this.keys = ["Positive", "Negative", "Neutral"]

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 40, bottom: 100, left: 50 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = 400 - vis.margin.top - vis.margin.bottom; // prob shouldn't be hardcoded

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("class", "sentiment-svg")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")

        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2)
            .domain(d3.range(0,2));

        vis.y = d3.scaleLinear()
            .range([vis.height,0]);

        // color palette = one color per subgroup
        vis.color = d3.scaleOrdinal()
            .domain(vis.keys)
            .range(d3.schemeSpectral[3])
            .unknown("#ccc")

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            //.tickFormat(d=>vis.category_names[d]); // kinda hardcoded...

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Story Count");

        // Tooltip placeholder
        vis.tooltip = d3.select("body").append("div")//`#${(vis.parentElement)}`).append('div')
            .attr('class', "sentiment-tooltip")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // console.log("inside sentiment vis", vis.data)
        // let storiesPerCategory = d3.range(0, 8).map(()=>0);
        // vis.data.forEach(story=>{
        //     story["Story Topic"].forEach((d, i)=>storiesPerCategory[i]+=d)
        // })
        // vis.displayData = storiesPerCategory

        // Wrangle Data for stacked bar plot
        //let storyDataByCategory = (Array.from(d3.group(vis.data, d=>d.Shift), ([key, value]) => ({key, value})))
        let stackedData = []
        if(storyCategory == "Shift"){
            vis.data.forEach((story, i)=>{
                let category = story[storyCategory] //each topic
                if(!(category in stackedData)){
                    stackedData[category] = {name: category, Positive: 0, Negative: 0, Neutral: 0}
                }
                stackedData[category].Positive += +story["Positive"]
                stackedData[category].Negative += +story["Negative"]
                stackedData[category].Neutral += +story["Neutral"]
            })
        }else{
            //we know it's binary data so we predefine presence/absence as our 2 bars
            stackedData[storyCategory] = {name: storyCategory, Positive: 0, Negative: 0, Neutral: 0}
            stackedData["No "+storyCategory.toLowerCase()] = {name: "No "+storyCategory.toLowerCase(), Positive: 0, Negative: 0, Neutral: 0}
            vis.data.forEach((story, i)=>{
                let category = story[storyCategory]?storyCategory:"No "+storyCategory.toLowerCase();
                stackedData[category].Positive += +story["Positive"]
                stackedData[category].Negative += +story["Negative"]
                stackedData[category].Neutral += +story["Neutral"]

            })

        }
        delete stackedData[""]
        stackedData = Object.values(stackedData)
        let finalStackedData = d3.stack()
            .keys(["Positive", "Negative", "Neutral"])
            (stackedData)
            .map(d => (d.forEach(v => v.key = d.key), d))
        vis.displayData = finalStackedData
        // console.log("stacked data:", vis.displayData)

        vis.updateVis();
    }

    updateVis() {
        //needs to updated based on the selectedCategory in main - TODO
        let vis  = this;
        // Update domains
        //vis.y.domain([0, d3.max(vis.displayData)]);
        vis.y.domain([0, d3.max(vis.displayData, d=>d3.max(d, d=>d[1]))]);
        // vis.color.domain(vis.displayData.map(d=>d.key)) //d key refers to pos neg neutral,
                                                    // so i can do this in initvis if needed

        // Call axes
        vis.svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);


        let barGroup = vis.svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(vis.displayData)

        vis.svg.selectAll("rect").remove()

        let barGroupEnter = barGroup.enter().append("g")
            .attr("fill", d=>vis.color(d.key))
        let bars = barGroupEnter
            .selectAll("rect")
            .data(d=>d, d=>d.name)

        bars
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", vis.x.bandwidth())
            .attr("x", function(d, index){
                return vis.x(index);
            })
            .attr("y", d=>vis.y(d[1]))
            .attr("height", d=>vis.y(d[0]) -vis.y(d[1]))
            .on("mouseover", function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX  + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                             <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                                 <h3> ${d.key}</h3>  
                                 <h4> Count: ${d.data[d.key]}</h4>   
                                 <h4> Category: ${d.data.name}</h4>  
                                  

                             </div>`);

            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d=>vis.color(d.key))

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        //.merge(barGroup)
        bars.merge(barGroup) //bars
            .transition()
            .duration(500)
            //.attr("x", (d, i)=>vis.x(d.data.name)) //after updating x scales
            .attr("x", function(d, index){
                return vis.x(index);
            })
            .attr("y", d=>vis.y(d[1]))
            .attr("height", d=>vis.y(d[0]) -vis.y(d[1]))


        barGroup.exit().remove();



        // Call axis function with the new domain
        vis.svg.select(".y-axis").call(vis.yAxis);

        vis.svg.select(".x-axis").call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-45)"
            });

    }
}
