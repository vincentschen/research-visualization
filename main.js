var nodes = [
  {name: "Microsoft"},
  {name: "Amazon"},
  {name: "HTC"},
  {name: "Samsung"},
  {name: "Apple"},
  {name: "Nokia"},
  {name: "HTC"},
  {name: "Barnes & Noble"}
];

var links = [
  {source: 0, target: 1, type: "agree"},
  {source: 2, target: 1, type: "agree"},
  {source: 4, target: 2, type: "disagree"},
  {source: 3, target: 5, type: "disagree"},
  {source: 7, target: 6, type: "normal"},
  {source: 3, target: 6, type: "disagree"},
  {source: 6, target: 4, type: "disagree"},
  {source: 2, target: 4, type: "disagree"},
];

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["agree", "disagree", "normal"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle")
    .attr("r", 6)

    //show text
  .on("mouseover", function(d) {

    //Get this bar's x/y values, then augment for the tooltip
    // var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
    // var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;

    //Update the tooltip position and value
    d3.select("#tooltip")
      .style("left", 0 + "px")
      .style("top", 0 + "px")
      .select("#value")
      .text(d);
    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
    })
    
    .on("mouseout", function() {
    //Hide the tooltip
    d3.select("#tooltip").classed("hidden", true);
  })
    .call(force.drag);

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", 12)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

d3.select(".circle")
  .on("mouseover", function(){return tooltip.style("visibility", "visible");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});



function mouseover(d) {
    // d is the node object
    // You can even get mouse position with this command
    var mousePos = d3.mouse(this);
}

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);  
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}