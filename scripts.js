var avg =
    [[
    [12, 0.326], [13, 0.323], [14, 0.287], [15, 0.299], [16, 0.315], [17, 0.306], [18, 0.312], [19, 0.291],
    ],
    [
    [12, 0.270], [13, 0.274], [14, 0.273], [15, 0.330], [16, 0.243], [17, 0.319], [18, 0.249], [19, 0.260]
    ]]

var year = -99;
var counter = -99;

var buttonsDone = false;

var screen = {width: 400, height:600};
var margins = {top:10, right:50, bottom:50, left:50};


var setupStackedBarCharts = function()
{        
    screen.height = 600;
    screen.width = 400;
    d3.select("svg").style("left", "25%")

    
    d3.select("svg *").remove();
    d3.select(".axis").remove();
    d3.select("#tooltip").classed("hidden", true);
    
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
    {12: 10.5, 13:9.0, 14:7.6, 15:9.4, 16:10.4, 17:6.6, 18:10.2, 19:8.3},
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
    
    var result = 0;
    
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
        result = num[1] - num[0];
        if(result.toString().substr(0, 2) == "10")
            {result = result.toPrecision(3)}
        else
            {result = result.toPrecision(2)}
                
        year = establishYear(result);
        d3.select("#tooltip").select("#year").text((year + 2000))
        d3.select("#tooltip").select("#war").text("WAR: " + result);
        d3.select("#tooltip").classed("hidden", false)
        .style("left", ((d3.event.pageX+6) + "px"))
        .style("top", ((d3.event.pageY-79) + "px"))
        })
    .on("mouseout", function(num)
        {d3.select("#tooltip").classed("hidden", true);})
    .on("click", function(num, index, array){
        d3.select("#subTitle").text("Batting Average")
        d3.select("#subTitle").style("left", "34%")
        d3.select("#troutLabel").remove()
        d3.select("#harperLabel").remove()
        d3.select("#phillies").remove()
        d3.select("#angels").remove()
        counter = 1;
        setupXToYScatterPlot(avg, 0.2, 0.370, year)
    })
        
}

var setupXToYScatterPlot = function(data, x, y, year)
{
    screen.height = 700;
    screen.wdith = 550;
    
    d3.select("svg *").remove();
    d3.select(".axis").remove();
    d3.select("#tooltip").classed("hidden", true);
    
    d3.select("body").select("svg")
    .attr("width", (screen.width - 50))
    .attr("height", screen.height)
    .append("g")
    .attr("id", "graph")
    .attr("transform", "translate("+margins.left+","+margins.top+")");
    
    d3.select("body").select("svg").select("#graph").append("g").attr("id", "trout")
    d3.select("body").select("svg").select("#graph").append("g").attr("id", "harper")
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear().domain([12, 19]).range([0, width]);
    var yScale = d3.scaleLinear().domain([x, y]).range([height, 0]);

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
    .data (data[0])
    .enter()
    .append("circle")
    
    d3.select ("#harper")
    .selectAll("circle")
    .data (data[1])
    .enter()
    .append("circle")
    
    addButtons();
    drawXToYScatterPlot(data, xScale, yScale, year);
}

var drawXToYScatterPlot = function(data, xScale, yScale, year)
{
    var arrays = d3.select("#trout")
    .selectAll("circle")
    .data(data[0])
    .transition()
    .attr("cx", function(d){ return xScale(d[0]) })
    .attr("cy", function(d){ return yScale(d[1]) })
    .attr("r", function(d)
    {
       if(d[0] == year)
           { return 7; }
        else
            {return 5;}
    })
    .attr("fill", function(d)
    { 
        if(d[0] == year)
            {return "DarkRed";}
        else
            {return "red";}
    });
    
    var arrays = d3.select("#harper")
    .selectAll("circle")
    .data(data[1])
    .transition()
    .attr("cx", function(d){ return xScale(d[0]) })
    .attr("cy", function(d){ return yScale(d[1]) })
    .attr("r", function(d)
    {
       if(d[0] == year)
           { return 7; }
        else
            {return 5;}
    })
    .attr("fill", function(d)
    { 
    if(d[0] == year)
        {return "DarkBlue";}
    else
        {return "blue";}
    });
    
    var legend = d3.select("body").append("svg").attr("class", "legend");
    var troutRect = legend.append("rect").attr("id", "troutRect");
    troutRect.attr("x", 150);
    troutRect.attr("y", 0);
    troutRect.attr("width", 20);
    troutRect.attr("height", 20);
    troutRect.attr("fill", "red");
    
    d3.select("body").append("h3").text("Trout").attr("id", "troutLegend");
    d3.select("body").append("h3").text("Harper").attr("id", "harperLegend");

    
    var harperRect = legend.append("rect").attr("id", "harperRect");
    harperRect.attr("x", 150);
    harperRect.attr("y", 50);
    harperRect.attr("width", 20);
    harperRect.attr("height", 20);
    harperRect.attr("fill", "blue");
    
}
   
var addButtons = function()
{
    if(buttonsDone)
        {return;}
    buttonsDone = true;
    
    var menu = d3.select("body").append("div").attr("class", "menu");
    
    menu.append("h3").text("Initial WAR Chart:")
    menu.append("button").attr("id", "initial").text(" WAR").on("click", function(){
        d3.select("body").append("h3").attr("id", "troutLabel").text("Trout")
        d3.select("body").append("h3").attr("id", "harperLabel").text("Harper")
        d3.select("body").append("img").attr("id", "angels").attr("src", "angels.jpg")
        d3.select("body").append("img").attr("id", "phillies").attr("src", "phillies.png")
        d3.select("body").select(".legend").remove();
        d3.select("body").select("#troutLegend").remove()
        d3.select("body").select("#harperLegend").remove()
        d3.select("body").select(".menu").remove()
        buttonsDone = false;
        d3.select("#subTitle").text("Wins Above Replacement")
        d3.select("#subTitle").style("left", "32%")
        setupStackedBarCharts();
    })
                                                             
    var hitForAvg = menu.append("div").attr("id", "hitForAvg");
    hitForAvg.append("h3").text("Hitting for Average:")
    
    var avg =
    [[
    [12, 0.326], [13, 0.323], [14, 0.287], [15, 0.299], [16, 0.315], [17, 0.306], [18, 0.312], [19, 0.291],
    ],
    [
    [12, 0.270], [13, 0.274], [14, 0.273], [15, 0.330], [16, 0.243], [17, 0.319], [18, 0.249], [19, 0.260]
    ]]
    
    hitForAvg.append("button").text("AVG")
    .on("click", function(){ 
        d3.select("#subTitle").text("Batting Average")
        d3.select("#subTitle").style("left", "34%")
        counter = 1;
        setupXToYScatterPlot(avg, 0.2, 0.370, year)
    })
    
    var obp =
    [[
    [12, 0.399], [13, 0.432], [14, 0.377], [15, 0.402], [16, 0.441], [17, 0.442], [18, 0.460], [19, 0.438],
    ],
    [
    [12, 0.340], [13, 0.368], [14, 0.344], [15, 0.460], [16, 0.373], [17, 0.413], [18, 0.393], [19, 0.372]
    ]]
    
    hitForAvg.append("button").text("OBP")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "36.5%")
        d3.select("#subTitle").text("On Base %")
        counter = 2;
        setupXToYScatterPlot(obp, 0.3, 0.5, year)})
    
    var triples = 
    [[
    [12, 8], [13, 9], [14, 9], [15, 6], [16, 5], [17, 3], [18, 4], [19, 2],
    ],
    [[12, 9], [13, 3], [14, 2], [15, 1], [16, 2], [17, 1], [18, 0], [19, 1]
    ]]
    
    hitForAvg.append("button").text("Triples")
    .on("click", function(){ 
        d3.select("#subTitle").text("Triples")
        d3.select("#subTitle").style("left", "37%")
        counter = 3;
        setupXToYScatterPlot(triples, 0, 10, year) });
    
    var walks =
    [[
    [12, 67], [13, 110], [14, 83], [15, 92], [16, 116], [17, 94], [18, 122], [19, 110],
    ],
    [[12, 56], [13, 61], [14, 38], [15, 124], [16, 108], [17, 68], [18, 130], [19, 99]
    ]]
    
    hitForAvg.append("button").text("Walks")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "37.25%")
        d3.select("#subTitle").text("Walks")
        counter = 4;
        setupXToYScatterPlot(walks, 0, 130, year) });
    
    var hitForPower = menu.append("div").attr("id", "hitForPower");
    hitForPower.append("h3").text("Hitting for Power:")
    
    var slg = 
    [[
    [12, 0.564], [13, 0.557], [14, 0.561], [15, 0.590], [16, 0.550], [17, 0.629], [18, 0.628], [19, 0.645],
    ],
    [
    [12, 0.477], [13, 0.486], [14, 0.423], [15, 0.649], [16, 0.441], [17, 0.595], [18, 0.496], [19, 0.510]
    ]]
    
    hitForPower.append("button").text("SLG")
    .on("click", function(){ 
        d3.select("#subTitle").text("Slugging %")
        d3.select("#subTitle").style("left", "36%")
        counter = 5;
        setupXToYScatterPlot(slg, 0.4, 0.7, year)})
    
    var hr = 
    [[
    [12, 30], [13, 27], [14, 36], [15, 41], [16, 29], [17, 33], [18, 39], [19, 45],
    ],
    [[12, 22], [13, 20], [14, 13], [15, 42], [16, 24], [17, 29], [18, 34], [19, 35]
    ]]
    
    hitForPower.append("button").text("Home Runs")
    .on("click", function(){ 
        d3.select("#subTitle").text("Home Runs")
        d3.select("#subTitle").style("left", "36%")
        counter = 6;
        setupXToYScatterPlot(hr, 0, 50, year)})
    
    var baseRunning = menu.append("div").attr("id", "baseRunning");
    baseRunning.append("h3").text("Base Running:")
    
    var sb = 
    [[
    [12, 49], [13, 33], [14, 16], [15, 11], [16, 30], [17, 22], [18, 24], [19, 11],
    ],
    [[12, 18], [13, 11], [14, 2], [15, 6], [16, 21], [17, 4], [18, 13], [19, 15]
    ]]
    
    baseRunning.append("button").text("Stolen Bases")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "35.5%")
        d3.select("#subTitle").text("Stolen Bases")
        counter = 7;
        setupXToYScatterPlot(sb, 0, 50, year)})
    
    var sbp = 
    [[
    [12, 0.907], [13, 0.825], [14, 0.889], [15, 0.611], [16, 0.811], [17, 0.846], [18, 0.923], [19, 0.846],
    ],
    [
    [12, 0.750], [13, 0.733], [14, 0.500], [15, 0.600], [16, 0.667], [17, 0.667], [18, 0.813], [19, 0.833]
    ]]
    
    baseRunning.append("button").text("Stolen Base %")
    .on("click", function(){
        d3.select("#subTitle").style("left", "35.5%")
        d3.select("#subTitle").text("Stolen Base %")
        counter = 8;
        setupXToYScatterPlot(sbp, 0.4, 1, year)})
    
    var runs = 
    [[
    [12, 129], [13, 109], [14, 115], [15, 104], [16, 123], [17, 92], [18, 101], [19, 110],
    ],
    [[12, 98], [13, 71], [14, 41], [15, 118], [16, 84], [17, 95], [18, 103], [19, 98]
    ]]
    
    baseRunning.append("button").text("Runs")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "37.5%")
        d3.select("#subTitle").text("Runs")
        counter = 9;
        setupXToYScatterPlot(runs, 0, 130, year)})
    
    var rBaser = 
    [[
    [12, 10], [13, 6], [14, 2], [15, -1], [16, 6], [17, 3], [18, 4], [19, 3],
    ],
    [[12, 2], [13, 1], [14, -1], [15, 3], [16, -2], [17, 1], [18, -1], [19, 1]
    ]]
    
    baseRunning.append("button").text("Rbaser")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "37%")
        d3.select("#subTitle").text("Rbaser")
        counter = 10;
        setupXToYScatterPlot(rBaser, -5, 10, year)})
    
    var fielding = menu.append("div").attr("id", "fielding");
    fielding.append("h3").text("Fielding:")
    
    var fieldingP = 
    [[
    [12, 0.988], [13, 0.994], [14, 0.992], [15, 1], [16, 0.989], [17, 0.996], [18, 1], [19, 0.987],
    ],
    [
    [12, 0.979], [13, 0.973], [14, 0.978], [15, 0.978], [16, 0.992], [17, 0.989], [18, 0.990], [19, 0.983]
    ]]
    
    fielding.append("button").text("Fielding %")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "36.5%")
        d3.select("#subTitle").text("Fielding %")
        counter = 11;;
        setupXToYScatterPlot(fieldingP, 0.970, 1, year)})
    
    var rPos = 
    [[
    [12, 0], [13, 0], [14, 3], [15, 4], [16, 3], [17, 2], [18, 2], [19, 2],
    ],
    [[12, -1], [13, -4], [14, -4], [15, -5], [16, -5], [17, -4], [18, -3], [19, -6]
    ]]
    
    fielding.append("button").text("Rpos")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "37.5%")
        d3.select("#subTitle").text("Rpos")
        counter = 12;
        setupXToYScatterPlot(rPos, -6, 4, year)})
    
    var adv = menu.append("div").attr("id", "adv");
    adv.append("h3").text("Other Advanced Stats:")
    
    var wlp = 
    [[
    [12, 0.552], [13, 0.540], [14, 0.531], [15, 0.542], [16, 0.549], [17, 0.530], [18, 0.549], [19, 0.538],
    ],
    [
    [12, 0.521], [13, 0.514], [14, 0.500], [15, 0.550], [16, 0.498], [17, 0.520], [18, 0.497], [19, 0.515]
    ]]
    
    adv.append("button").text("162WL%")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "34%")
        d3.select("#subTitle").text("162 Win/Loss %")
        counter = 13;
        setupXToYScatterPlot(wlp, 0.400, 0.560, year)})
    
    var waa = 
    [[
    [12, 8.4], [13, 6.8], [14, 5.3], [15, 7], [16, 8.1], [17, 4.9], [18, 8.1], [19, 6.3],
    ],
    [[12, 3.4], [13, 2.1], [14, -0.2], [15, 8], [16, -0.4], [17, 3.2], [18, -0.8], [19, 2.1]
    ]]
    
    adv.append("button").text("WAA")
    .on("click", function(){ 
        d3.select("#subTitle").style("left", "32%")
        d3.select("#subTitle").text("Wins Above Average")
        counter = 14;
        setupXToYScatterPlot(waa, -1, 9, year)})
    
    var toggle = menu.append("div").attr("id", "toggle");
    toggle.append("h3").text("Turn Off Specific Year Markers:")
    toggle.append("button").text("------").on("click", function()
    {
        year = -99;
        if(counter == 1)
            setupXToYScatterPlot(avg, 0.2, 0.370, year)
        else if(counter == 2)
            setupXToYScatterPlot(obp, 0.3, 0.5, year)
        else if(counter == 3)
            setupXToYScatterPlot(triples, 0, 10, year)
        else if(counter == 4)
            setupXToYScatterPlot(walks, 0, 130, year)
        else if(counter == 5)
            setupXToYScatterPlot(slg, 0.4, 0.7, year)
        else if(counter == 6)
            setupXToYScatterPlot(hr, 0, 50, year)
        else if(counter == 7)
            setupXToYScatterPlot(sb, 0, 50, year)
        else if(counter == 8)
            setupXToYScatterPlot(sbp, 0.4, 1, year)
        else if(counter == 9)
            setupXToYScatterPlot(runs, 0, 130, year)
        else if(counter == 10)
            setupXToYScatterPlot(rBaser, -5, 10, year)
        else if(counter == 11)
            setupXToYScatterPlot(fieldingP, 0.970, 1, year)
        else if(counter == 12)
            setupXToYScatterPlot(rPos, -6, 4, year)
        else if(counter == 13)
            setupXToYScatterPlot(wlp, 0.400, 0.560, year)
        else if(counter == 14)
            setupXToYScatterPlot(waa, -1, 9, year)
    })
}

var establishYear = function(num)
{
    if(num == 10.5 || num == 5.2)
        return 12;
    else if(num == 9 || num == 3.7)
        return 13;
    else if(num == 7.6 || num == 1.1)
        return 14;
    else if(num == 9.4 || num == 10)
        return 15;
    else if(num == 10.4 || num == 1.5)
        return 16;
    else if(num == 6.6 || num == 4.6)
        return 17;
    else if(num == 10.2 || num == 1.3)
        return 18;
    else if(num == 8.3 || num == 4.2)
        return 19;
    else
        return -99;
}

setupStackedBarCharts();