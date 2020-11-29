class BarVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.categories = {
            "Human Interactions" : ["Approaches", "Indifferent", "Runs from", "Other Interactions"],
            "Activities" : ["Running", "Chasing", "Climbing", "Eating", "Foraging", "Other Activities"],
            "Sounds" : ["Kuks", "Moans", "Quaas"]
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

        // DELETE RECT WHEN READY TO CODE
        // vis.svg
        //     .append("rect")
        //     .attr("x",0)
        //     .attr("y",0)
        //     .attr("width",vis.width)
        //     .attr("height", vis.height)

        // A scale that gives a X target position for each group
        vis.x = d3.scaleBand() //or scalepoint?
            //.domain([1, 2, 3])
            .range([0, vis.width])
        // Make a scale that gives target Xs for each category
        // vis.humanInteractionsX = d3.scaleBand() //or scalepoint?
        //     .domain(vis.categories["Human Interactions"])
        //     .range([0, vis.width])
        //
        // vis.activitiesX = d3.scaleBand() //or scalepoint?
        //     .domain(vis.categories["Activities"])
        //     .range([0, vis.width])
        //
        // vis.soundsX = d3.scaleBand() //or scalepoint?
        //     .domain(vis.categories["Sounds"])
        //     .range([0, vis.width])

        // A color scale
        vis.color = d3.scaleOrdinal()
            //.domain([1, 2, 3])
            .range([ "#F8766D", "#00BA38", "#619CFF", "#EC8643"])

        // Tooltips append placeholder div
        vis.tooltip = d3.select("body").append("div")//`#${(vis.parentElement)}`).append('div')
            .attr('class', "bubble-tooltip")

        // Group to hold the circles later
        vis.circlesGroup = vis.svg.append("g")
            .attr("class", "circles-group")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        // console.log("inside bubble vis, data:", vis.data)

        vis.category = bubbleCategory
        console.log("NEW CATEGORY SELECTED", vis.category)
        vis.displayData = []
        vis.data.forEach((squirrel, i)=>{
            //if(squirrel[vis.category].indexOf(1) != -1
            if(!Object.keys(vis.categories).map(d=> squirrel[d].indexOf(1)).includes(-1))
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
        //vis.displayData = vis.displayData.slice(0, 100);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //update domains
        vis.x.domain(vis.categories[vis.category])
        vis.color.domain(vis.categories["Human Interactions"]) //all colors based on human interactions
    }

}
