/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
      height = window.innerHeight * 0.7,
      margin = {top: 20, left: 60, bottom: 60, right: 20},
      radius = 3;

/* LOAD DATA */
d3.csv("../data/usHeatExtremes.csv", d3.autoType)
  .then(data => {
  console.log(data, )
  
  /* SCALES */
  const xScale = d3.scaleLinear()
  .domain([Math.min(...data.map((d => d.Lat))), Math.max(...data.map((d => d.Lat)))])
  .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
  .domain([Math.min(...data.map((d => d.Long))), Math.max(...data.map((d => d.Long)))])
  .range([height - margin.bottom, margin.top])
  
  // Color Scale
  const colorScale = d3.scaleOrdinal()
  // red changes more, green changes less, blue is ocean
  .domain([Math.min(...data.map((d => d["Change in 95 percent Days"]))), Math.max(...data.map((d => d["Change in 95 percent Days"])))])
  .range(["#ff0000", "#ee1100", "#dd2200","#cc3300","#bb4400","#aa5500","#996600","#887700", "#778800","#669900","#55aa00","#44bb00","#33cc00", "#22dd00", "#11ff00"].reverse())

  /* HTML ELEMENTS */
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "Blue")

  const dots = svg.selectAll(".dot")
  .data(data)
  .join("circle")
  .join(
    enter => enter.append("circle")
    .call(selection => 
      selection
      .transition()
      .duration(1000)
      .attr("r", radius)),
    update => update,
    exit => exit
  )
  .attr("class", "dot")
  .attr("r", radius)
  .attr("cx", d => xScale(d.Lat))
  .attr("cy", d => yScale(d.Long))
  .style("fill", d => colorScale(d["Change in 95 percent Days"]))

});