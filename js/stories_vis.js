/*
 *  StoriesVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with ????
 */

let globalData;
class StoriesVis {

    constructor(_parentElement, _storiesData, _commonWords) {
        this.parentElement = _parentElement;
        this.data = _storiesData;
        this.commonWords = _commonWords;

        globalData = _storiesData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 0, right: 10, bottom: 0, left: 10 };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr("class", "stories-svg")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")


        //Creating scale to scale wordcloud words
        vis.sizeScale = d3.scaleLinear()
            .domain([0, 1002]) //most common word is squirrel
            .range([10, d3.min([vis.width/9, 90])]); // 95 because 100 was causing stuff to be missing
                        // has issues when too small, maybe do cases min(vis.width/8, 66)
        console.log("word cloud width: ", vis.width)

        vis.colorScale = d3.scaleLinear()
            .domain([0, 1002])
            .range(["#233D4D", "#FCCA46"])

        // Color scale legend
        // Legend and scale
        vis.defs = vis.svg.append("defs")

        var linearGradient = vis.defs.append("linearGradient")
            .attr("id", "linear-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")

        //Set the color for the start (0%)
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#233D4D"); //light blue

        //Set the color for the end (100%)
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#FCCA46"); //dark blue
        //Draw the rectangle and fill with gradient
        vis.svg.append("rect")
            .attr("width", 200)
            .attr("height", 20)
            .attr("transform", `translate(10, ${20})`)
            .style("fill", "url(#linear-gradient)")
            .style("stroke", "none");

        vis.legendX = d3.scaleLinear()
            .domain([0, 1002])
            .range([0, 200])
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "legend-axis")
            .attr("transform", `translate(10, ${40})`)
        vis.xAxis = d3.axisBottom()
            .scale(vis.legendX)
            .ticks(5)
            .tickFormat(d3.format("d"))//".2s"))

        //console.log(vis.commonWords.slice(0, 50).map(function(d) { return {text: d.word, size: vis.sizeScale(d.size)}; }))
        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        vis.layout = d3.layout.cloud()
                .size([vis.width, vis.height])
                .words(vis.commonWords.slice(0, 50).map(function(d) { return {text: d.word, size:d.size}; }))
                //.text(function(d) { return d.text; }) //to resolve overlapping words
                .font("Poppins")
                .padding(3)        //space between words
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .fontSize(function(d) { return vis.sizeScale(d.size); })      // font size of words
                .random(function(d) { return 0.5; })
                .on("end", vis.draw)


        vis.layout.start();

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = vis.data;
        // console.log("inside story vis", vis.data)
        vis.updateVis();
    }

    updateVis() {
        let vis  = this;

        vis.xAxisGroup.call(vis.xAxis)

    }
    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    draw(words) {
        // this.size = vis.height/vis.width, so we just replce
        let colorScale = d3.scaleLinear()
            .domain([0, d3.max(words, d=>d.size)])
            .range(["#233D4D", "#FCCA46"])

        words.sort((a, b) => b.size - a.size)
        // console.log(words)
        d3.select(".stories-svg").append("g")
            .attr("transform", "translate(" + this.size()[0] / 2 + "," + this.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", d=>colorScale(d.size))
            .attr("text-anchor", "middle")
            .attr("class", "word-cloud-text")
            .style("font-family", "Poppins")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
            .on("click", (event, d)=>{
                if(globalData.length > 0) {
                    let wordStories = globalData.filter(row => {
                        return row["Note Squirrel & Park Stories"].toLowerCase().includes(d.text)
                    })
                    d3.select("#sample_stories")
                        .style("opacity", "100%")
                    d3.select("#sample_stories")
                        .html(
                            '<h3> Sample "'+d.text.charAt(0).toUpperCase()+d.text.substr(1) +'" Story </h3>' +
                            '<p>'+wordStories[Math.floor(Math.random()*wordStories.length)]["Note Squirrel & Park Stories"]
                            +'</p>'
                        )
                }
            })

    }

}


