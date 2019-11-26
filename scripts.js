
var screen = {width: 400, height:500};
var margins = {top:10, right:50, bottom:50, left:50};


var setup = function()
{        
     d3.select("body").append("p");
     console.log(d3)
    
     d3.select("body").select("svg")
    .attr("width", screen.width)
    .attr("height", screen.height)
    .append("g")
    .attr("id", "graph")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0, 80]).range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    d3.select("svg").append("g").classed("axis", true);

    d3.select(".axis")
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", "translate(25, "+margins.top+")")
    .call(yAxis);
    
    drawStackedBarCharts(xScale, yScale);
}

var drawStackedBarCharts = function(xScale, yScale)
{
    var war = [
    {12: 10.5, 13:9.0, 14:7.6, 15:9.4, 16:10.5, 17:6.6, 18:10.2, 19:8.3},
    {12: 5.2, 13:3.7, 14:1.1, 15:10.0, 16:1.5, 17:4.6, 18:1.3, 19:4.2}
    ]

    var stack = d3.stack().keys(["12", "13", "14", "15", "16", "17", "18", "19"]);
    var series = stack(war);
    console.log(series)
    var colors = ["black", "red", "blue", "green", "pink", "yellow", "purple", "brown"]
    
    
    
    var groups = d3.select("#graph")
    .selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", function(d, i){ return colors[i]; });
    
    var rects = groups.selectAll("rect")
    .data(function(d){ return d; })
    .enter()
    .append("rect")
    .attr("x", function(d, i){ return xScale(i); })
    .attr("y", function(d){ return yScale(d[1]); })
    .attr("height", function(d){ return yScale(d[0]) - yScale(d[1]);})
    .attr("width", 40); //bandwidth?
}

setup();