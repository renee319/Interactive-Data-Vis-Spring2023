/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
      height = window.innerHeight * 0.7,
      margin = {top: 20, left: 60, bottom: 60, right: 20},
      radius = 6;

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
  
  // Color scale
  const colorScale = d3.scaleOrdinal()
  // red changes more, green changes less, blue is ocean
  .domain([Math.min(...data.map((d => d["Change in 95 percent Days"]))), Math.max(...data.map((d => d["Change in 95 percent Days"])))])
  .range(["#0000ff", "#0011ee", "#0022dd","#0033cc","#0044bb","#0055aa","#006699","#007788", "#008877","#009966","#00aa55","#00bb44","#00cc33", "#00dd22", "#00ff11"].reverse())

  const radiusScale = d3.scaleLinear()
  .domain([Math.min(...data.map((d => d["Change in 95 percent Days"]))), Math.max(...data.map((d => d["Change in 95 percent Days"])))])
  .range([4, 8])

  /* HTML ELEMENTS */
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "Brown")

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
  .attr("r", d => radiusScale( d["Change in 95 percent Days"]))
  .attr("cx", d => xScale(d.Lat))
  .attr("cy", d => yScale(d.Long))
  .style("fill", d => colorScale(d["Change in 95 percent Days"]))
});