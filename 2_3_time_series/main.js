/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { left: 20, top: 60, bottom: 60, right: 20};

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv',  d3.autoType)
.then(data => {
  console.log('data :>> ', data);
  // SCALES  
  const xScale = d3.scaleBand()
    .domain([...data.map((d => d.activity))])
    .range([margin.left, height - margin.right])
    .padding(0.1)
  
  // Y Scale
  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.count))
  .range([height - 2.3*margin.bottom, margin.top])

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
    .x(d => xScale(d.activity))
    .y(d => yScale(d.count))
  
  const areaGen = d3.area()
  .x(d => xScale(d.activity))
  .y1(d => yScale(d.count))
  .y0(yScale(0))

  // Group Data
  const groupedData = d3.groups(data, d => d.country)
  
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
    .style("transform", `translate(${-2.7 * margin.right}px, ${height - 0.5*margin.bottom}px`)
    .call(xAxis)
});