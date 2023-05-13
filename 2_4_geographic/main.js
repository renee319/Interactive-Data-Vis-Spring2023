/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  legendWidth = 100,
  legendHeight = 10;

 Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/stateCapitals.csv", d3.autoType),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, capitals, usHeatExtremes]) => {
  svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  const projection = d3.geoAlbersUsa()
  .fitSize([
    width-margin.left-margin.right,
    height-margin.top-margin.bottom
  ], geojson);

  const path = d3.geoPath(projection)

  const states = svg.selectAll("path.states")
    .data(geojson.features)
    .join("path")
    .attr("class", 'states')
    .attr("stroke", "gray")
    .attr("fill", "lightgray")
    .attr("d", path)

  const dataExtent = d3.extent(usHeatExtremes, d => d.Change)

  colorScale = d3.scaleDiverging()
    .domain([dataExtent[0], 0, dataExtent[1]])
    .interpolator(d3.interpolateYlGn)

  svg.selectAll("circle.heat")
    .data(usHeatExtremes)
    .join("circle")
    .attr("r", 3.5)
    // .attr("r", d => Math.abs(radiusScale(d.Change))*8)
    .attr("class", "heat")
    // .attr("stroke", "#FFFFFF")
    .attr("stroke-width", "0.1")
    .attr("fill", d => colorScale(d.Change)) 
    .attr("transform", d => {
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`

    })
});