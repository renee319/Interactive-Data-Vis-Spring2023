/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { left: 20, top: 60, bottom: 50, right: 20};

/* LOAD DATA */
d3.csv('../data/afganistanOverTime.csv',  d3.autoType)
.then(data => {
  console.log('data :>> ', data)
  // SCALES  
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => new Date( d.Year, 0)))
    .range([margin.left, width - margin.right])

  // Y Scale
  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.Population))
  .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  // BUILD AND CALL AXES
  // const filteredData = data.filter(d => d.country === "US")
  // console.log("filtered", filteredData)
  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(new Date(d.Year, 0)))
    .y(d => yScale(d.Population))
  
  const areaGen = d3.area()
  .x(d => xScale(new Date(d.Year, 0)))
  .y1(d => yScale(d.Population))
  .y0(d3.extent(data, d => d.Population)[0])

  // Group Data
  const groupedData = d3.groups(data, d => d.Entity)
  console.log(groupedData)
  
  // DRAW LINE
  const line = svg.selectAll(".area")
    .data(groupedData)
    .enter()
    .append("path")
    .attr("d", ([activity, data]) => areaGen(data))
    .attr("stroke", "black")
    .attr("fill", "#94877C")

  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
    .style("transform", `translate(0px, ${height - margin.bottom}px)`)
    .call(xAxis)
});