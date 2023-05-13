/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = { min: 1, max:15};
  colors = {national: '#0000FF', american: '#FF0000'}

/* LOAD DATA */
d3.csv('../data/mlbSeasonStats.csv', d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */
    const xScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.strikeouts)), d3.max(data.map(d => d.strikeouts))])
    .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.homeruns), d3.max(data, d => d.homeruns)])
    .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
    .domain(["National", "American"])
    .range([colors.national, colors.american, "blue"])

    const sizeScale = d3.scaleSqrt()
    .domain([d3.min(data, d => d.wins), d3.max(data, d => d.wins)])
    .range([radius.min, radius.max])
    console.log(sizeScale)

    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
    
    const dot = svg
    .selectAll("circle")
    .data(data, d => d.team) 
    .join("circle")
    .attr("cx", d => xScale(d.strikeouts))
    .attr("cy", d => yScale(d.homeruns))
    .attr("r", d => sizeScale(d.wins))
    .attr("fill", d => colorScale(d.league))
    .attr("class", "bubble")

    // team labels for circles
    const teamLabels = svg
    .selectAll(".team-labels")
    .data(data, d => d.teamAbbrev)
    .join("text")
    .attr("x", d => xScale(d.strikeouts))
    .attr("y", d => yScale(d.homeruns))
    .text(d => d.teamAbbrev)
    .attr("text-anchor", "left")
    //.attr("class", "team-labels")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "gray");
  });