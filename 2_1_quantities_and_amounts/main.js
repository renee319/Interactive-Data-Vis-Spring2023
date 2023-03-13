
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7;
const height = window.innerHeight * 0.7;
margin = 50;

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    const svg = d3.select("#container")
      .append('svg')
      .attr("width", width)
      .attr("height", height)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const yScale = d3.scaleBand()
      .domain(['running', 'chasing', 'climbing', 'eating', 'foraging'])
      .range([margin, height - margin])
      .padding(0.1)

    // console.log(xScale)

    // const mapped = [...data.map((d => d.count))]
    // console.log('mapped', mapped)
    // const extent = d3.extent(mapped)
    // console.log(extent)
    const mapped = [...data.map((d => d.count))]
    console.log('mapped', mapped)
    const extent = d3.extent(mapped)
    console.log(extent)
    
    // y scale
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map((d => d.count)))])
      .range([margin, width - margin])
    
    /* HTML  Elements */
    // append rectangles
    svg.selectAll("rect.bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
    // Make them visible
    .attr('x', d => margin)
    .attr('y', d => yScale(d.activity))
    // width and height
    .attr("width", d =>  - margin + xScale(d.count))
    .attr("height", yScale.bandwidth())

    /* Axes */
    const xAxis = d3.axisBottom(xScale)
    console.log(xAxis)
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
      .style("transform", `translate(0px, ${height - margin}px`)
      .call(xAxis)

    svg.append("g")
      .style("transform", `translate(${margin}px, 0px)`)
      .call(yAxis)
  })