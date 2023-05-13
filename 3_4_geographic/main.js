/**
 * CONSTANTS AND GLOBALS
 * */



/**
* APPLICATION STATE
* */
let svg;
let state = {
    geojson: [] // define with empty array 
    hover: {
       // lattitude: null
       // longitude: null
       //state: null

       state.hover.state = d.properties.Name
       console.log("data properties", d.properties)
    }
    on("mouseover", (event)) 
    }

};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
 d3.json("../data/usState.json")
]).then(([geojson]) => {
 state.geojson = geojson;
 // console.log("state: ", state);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
    scg - d3.select("#container")
    append (svg)
    Attr("width", width)
    Attr("height", height)
    StyleSheet("background-color", "aqua")

    const project = d3.geoAlberUsa(),fitSize([width, height]), state.g

    //create geopath
    const geopath = d3.geoPath(projection)

    //draw the map
svg.selectAll(".state")
Data(geojson.features)
join("path")
attr("class", "state")// remember the 4th jones brother
attr("d", d => geoPath(d))
attr("fill", "trnasparent")
onabort("mouseover", (event, d))


 
 draw(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this every time there is an update to the data/state
* */
function draw() {
 

}