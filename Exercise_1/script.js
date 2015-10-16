console.log("Exercise 6-1");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:20,l:20};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//This is just to help you visualize the extent of the <g.plot-area> element
var background = plot.append('rect')
    .attr('width',width)
    .attr('height',height)
    .style('stroke','rgb(100,100,100)')
    .style('stroke-width','2px')
    .style('fill-opacity',.03)

//Start importing data
d3.csv('../data/world_bank_2012.csv', parse, dataLoaded);

function parse(d) {
    //For now, return the old row verbatim as the new row
    /*if( d['GDP per capita, PPP (constant 2011 international $)']==".."){
     return;*/

    /*var newRow = {};
     newRow.gdpPerCap =*

     return{newRow};*/

    return {
        ctr: d['Country Name'],
        ctrC: d['Country Code'],
        gdpPerCap: (d['GDP per capita, PPP (constant 2011 international $)'] == "..")
            ? undefined : +d['GDP per capita, PPP (constant 2011 international $)'],

        primCompRate: (d['Primary completion rate, total (% of relevant age group)'] == "..")
            ? undefined : +d['Primary completion rate, total (% of relevant age group)'],

        urbPop: (d['Urban population (% of total)'] == "..")
            ? undefined : +d['Urban population (% of total)']
    };


    //What are some issues we might encounter as we parse this?
}

function dataLoaded(error, rows){
    var minGdpPerCap = d3.min(rows, function (d) {return d.gdpPerCap;}),
        maxGdpPerCap = d3.max(rows, function (d) {return d.gdpPerCap;});

    var minPrimCompRate = d3.min(rows, function (d) {return d.primCompRate;}),
        maxPrimCompRate = d3.max(rows, function (d) {return d.primCompRate;});

    var minUrbPop = d3.min(rows, function (d) {return d.urbPop;}),
        maxUrbPop = d3.max(rows, function (d) {return d.urbPop;});


    console.log(minGdpPerCap, maxGdpPerCap);
    console.log(minPrimCompRate, maxPrimCompRate);
    console.log(minUrbPop, maxUrbPop);
    console.log(rows);

    var scaleX = d3.scale.linear()
        .domain([minGdpPerCap,maxGdpPerCap])
        .range([50, width*1.6]);

    var scaleY = d3.scale.linear()
        .domain([minPrimCompRate, maxPrimCompRate])
        .range([height-30,80]);

    rows.forEach(function (country) {
            if(country.gdpPerCap == undefined || country.primCompRate == undefined){
                return;
            }
        var xPos = scaleX(country.gdpPerCap),
            yPos = scaleY(country.primCompRate);

        var node = plot.append('g')
            .attr('class', 'country')
            .attr('transform', 'translate(' + xPos + ',' + yPos + ')')

        node
            .append('circle')
            .attr('r', country.urbPop)
            .style('fill', 'rgb(0,100,255)')
            .style('fill-opacity', .1)
            .style('stroke','rgb(255,255,255)')
            /*.style('z-index', 100)*/;

        node
            .append('text')
            .style('font-size', '10px')
            .style('fill', 'rgb(255,255,255)')
            .style('font-weight', 'thin')
            .text(country.ctrC)
            /*.style('z-index', 99)*/;
    }

)}


