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
            vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")

        // DELETE RECT WHEN READY TO CODE
        // vis.svg
        //     .append("rect")
        //     .attr("x",0)
        //     .attr("y",0)
        //     .attr("width",vis.width)
        //     .attr("height", vis.height)

        //Creating scale to scale wordcloud words
        var sizeScale = d3.scaleLinear()
            .domain([0, 1002]) //most common word is squirrel
            .range([10, vis.width/8]); // 95 because 100 was causing stuff to be missing
                        // has issues when too small, maybe do cases min(vis.width/8, 66)
        console.log("word cloud width: ", vis.width)

        // console.log(vis.commonWords.slice(0, 20).map(function(d) { return {text: d.word, size:d.size}; }))
        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        vis.layout = d3.layout.cloud()
                .size([vis.width, vis.height])
                .words(vis.commonWords.slice(0, 45).map(function(d) { return {text: d.word, size:d.size}; }))
                //.text(function(d) { return d.text; }) //to resolve overlapping words
                .font("Poppins")
                .padding(3)        //space between words
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .fontSize(function(d) { return sizeScale(d.size); })      // font size of words
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

    }
    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    draw(words) {
        // this.size = vis.height/vis.width, so we just replce

        words.sort((a, b) => b.size - a.size)
        // console.log(words)
        d3.select("svg").append("g")
            .attr("transform", "translate(" + this.size()[0] / 2 + "," + this.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .attr("class", "word-cloud-text")
            .style("font-family", "Poppins")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
            .on("click", (event, d)=>{
                //console.log(globalData[0], globalData[Math.floor(Math.random()*globalData.length)])
                d3.select("#sample_stories").text(globalData[Math.floor(Math.random()*globalData.length)]["Note Squirrel & Park Stories"])
            })

    }
}
