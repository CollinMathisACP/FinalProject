
var screen = {width: 500, height:600};
var margins = {top:10, right:50, bottom:50, left:50};


var setup = function()
{            
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
    .attr("width", 40)
    .on("mouseover", function(num)
        {
        var result = num[1] - num[0];
        if(result.toString().substr(0, 2) == "10")
            {result = result.toPrecision(3)}
        else
            {result = result.toPrecision(2)}
                
        d3.select("#tooltip").select("#war").text("WAR: " + result);
        d3.select("#tooltip").classed("hidden", false)
        .style("left", ((d3.event.pageX+6) + "px"))
        .style("top", ((d3.event.pageY-79) + "px"))
        })
    .on("mouseout", function(num)
        {d3.select("#tooltip").classed("hidden", true);})
    .on("click", function(){
        setupZeroToOneScatterPlot()
    })
        
}

var setupZeroToOneScatterPlot = function()
{
    var avg =
    [[
    [12, 0.326], [13, 0.323], [14, 0.287], [15, 0.299], [16, 0.315], [17, 0.306], [18, 0.312], [19, 0.291],
    ],
    [
    [12, 0.270], [13, 0.274], [14, 0.273], [15, 0.330], [16, 0.243], [17, 0.319], [18, 0.249], [19, 0.260]
    ]]
    
    screen.height = 900;
    
    d3.select("svg *").remove();
    d3.select(".axis").remove();
    d3.select("#tooltip").classed("hidden", true);
    
    d3.select("body").select("svg")
    .attr("width", screen.width)
    .attr("height", screen.height)
    .append("g")
    .attr("id", "graph")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    d3.select("body").select("svg").select("#graph").append("g").attr("id", "trout")
    d3.select("body").select("svg").select("#graph").append("g").attr("id", "harper")
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear().domain([12, 19]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0.0, 1.0]).range([height, 0]);

    var xAxis = d3.axisBottom(xScale).ticks(7);
    var yAxis = d3.axisLeft(yScale);
    d3.select("svg").append("g").classed("axis", true);

    d3.select(".axis")
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", "translate(35, "+margins.top+")")
    .call(yAxis);
    
    d3.select(".axis")
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate ("+margins . left+", " +(margins.top+height)+")")
    .call(xAxis);
    
    d3.select ("#trout")
    .selectAll("circle")
    .data (avg[0])
    .enter()
    .append("circle")
    
    d3.select ("#harper")
    .selectAll("circle")
    .data (avg[1])
    .enter()
    .append("circle")
    
    addButtons(xScale, yScale);
    drawZeroToOneScatterPlot(avg, xScale, yScale);
}

var drawZeroToOneScatterPlot = function(avg, xScale, yScale)
{
    var arrays = d3.select("#trout")
    .selectAll("circle")
    .data(avg[0])
    .transition()
    .attr("cx", function(d){ return xScale(d[0]) })
    .attr("cy", function(d){ return yScale(d[1]) })
    .attr("r", 5)
    .attr("fill", "red")
    
    var arrays = d3.select("#harper")
    .selectAll("circle")
    .data(avg[1])
    .transition()
    .attr("cx", function(d){ return xScale(d[0]) })
    .attr("cy", function(d){ return yScale(d[1]) })
    .attr("r", 5)
    .attr("fill", "blue")
}
   
var addButtons = function(xScale, yScale)
{
    var hitForAvg = d3.select("body").append("div").attr("id", "hitForAvg");
    hitForAvg.append("h3").text("Hitting for Average:")
    
    var avg =
    [[
    [12, 0.326], [13, 0.323], [14, 0.287], [15, 0.299], [16, 0.315], [17, 0.306], [18, 0.312], [19, 0.291],
    ],
    [
    [12, 0.270], [13, 0.274], [14, 0.273], [15, 0.330], [16, 0.243], [17, 0.319], [18, 0.249], [19, 0.260]
    ]]
    
    hitForAvg.append("button").text("AVG")
    .on("click", function(){ drawZeroToOneScatterPlot(avg, xScale, yScale) })
    
    var obp =
    [[
    [12, 0.399], [13, 0.432], [14, 0.377], [15, 0.402], [16, 0.441], [17, 0.442], [18, 0.460], [19, 0.438],
    ],
    [
    [12, 0.340], [13, 0.368], [14, 0.344], [15, 0.460], [16, 0.373], [17, 0.413], [18, 0.393], [19, 0.372]
    ]]
    
    hitForAvg.append("button").text("OBP")
    .on("click", function(){ drawZeroToOneScatterPlot(obp, xScale, yScale) })
    
    var hitForPower = d3.select("body").append("div").attr("id", "hitForPower");
    hitForPower.append("h3").text("Hitting for Power:")
    
    var slg = 
    [[
    [12, 0.564], [13, 0.557], [14, 0.561], [15, 0.590], [16, 0.550], [17, 0.629], [18, 0.628], [19, 0.645],
    ],
    [
    [12, 0.477], [13, 0.486], [14, 0.423], [15, 0.649], [16, 0.441], [17, 0.595], [18, 0.496], [19, 0.510]
    ]]
    
    hitForPower.append("button").text("SLG")
    .on("click", function(){ drawZeroToOneScatterPlot(slg, xScale, yScale) })
    
    var baseRunning = d3.select("body").append("div").attr("id", "baseRunning");
    baseRunning.append("h3").text("Base Running:")
    
    var sbp = 
    [[
    [12, 0.907], [13, 0.825], [14, 0.889], [15, 0.611], [16, 0.811], [17, 0.846], [18, 0.923], [19, 0.846],
    ],
    [
    [12, 0.750], [13, 0.733], [14, 0.500], [15, 0.600], [16, 0.667], [17, 0.667], [18, 0.813], [19, 0.833]
    ]]
    
    baseRunning.append("button").text("Stolen Base %")
    .on("click", function(){ drawZeroToOneScatterPlot(sbp, xScale, yScale) })
    
    
}
setup();