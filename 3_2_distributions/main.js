/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;
  
//   height = ,
//   margin = ,
//   radius = ;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
// let svg;
// let xScale;
// let yScale;
// let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedParty: "All" // + YOUR INITIAL FILTER SELECTION
};

/* LOAD DATA */
d3.json("../data/environmentRatings.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d => d.ideologyScore2020))
  .range([margin.left, width - margin.right])

  yScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d => d.envScore2020))
  .range([height - margin.bottom, margin.bottom])

  colorScale = d3.scaleOrdinal()
    .domain(["R", "D"])
    .range(["red", "d"])

      // are there independent? 
      const filterData = state.data.filter((d) => d.log )
  // + AXES


  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown")
   .data("ALL", "Democrat" , "Republican")
   .join("option")
   .attr("value", d=>d )
   .html(d=>d)
   .on('change' , (event)=>{
    console. log('selected' , event.target.value)})


  // + CREATE SVG ELEMENT


  // + CALL AXES



  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    // .filter(d => state.selectedParty === "All" || state.selectedParty === d.Party)

  const dot = svg
    .selectAll("circle")
    .data(filteredData, d => d.BioID)
    .join(
      // + HANDLE ENTER SELECTION
      enter => enter.append("circle")
      .attr("cx", d => xScale(d.ideologyScore2020))

      // + HANDLE UPDATE SELECTION
      update => update,
      

      // + HANDLE EXIT SELECTION
      exit => exit
    );
}