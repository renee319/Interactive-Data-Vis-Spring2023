const RACES = {
  all: "All people",
  white: "White",
  whiteAlone: "White alone, not Hispanic",
  black: "Black",
  asian: "Asian",
  hispanic: "Hispanic (any race)",
  whiteCombi: "White alone or in combination",
  notWhiteCombi: "White alone or in combination, not Hispanic",
  blackCombi: "Black alone or in combination",
  asianCombi: "Asian alone or in combination",
};

const blockedRaces = [];

async function readCSVData(path, gender) {
  return new Promise((resolve, reject) => {
    d3.dsv(";", path)
      .then((csvData) => {
        const data = [];

        for (let i = 0; i < Object.keys(RACES).length; i++) {
          const lineData = [];
          const currentRace = Object.keys(RACES)[i];
          if (blockedRaces.includes(currentRace)) continue;

          for (let j = 0; j < csvData.length; j++) {
            const value = csvData[j][`${currentRace}_${gender || "Total"}`];
            const year = csvData[j].Year;

            lineData.push({
              date: new Date(year, 0, 1),
              value: Number(value === "N" ? 0 : value.replace(/,/, ".")),
            });
          }

          data.push({
            name: currentRace,
            values: lineData,
          });
        }

        resolve(data);
      })
      .catch((e) => reject(e));
  });
}

export default class LineChart {
  data;
  color;
  gender;
  x;
  y;
  line;
  width;
  height;
  selector;
  path;

  constructor(selector) {
    this.color = (race) => {
      const colors = {
        all: "#1E90FF",
        white: "#ffffff",
        whiteAlone: "#E0E0E0",
        black: "#000000",
        asian: "#FFD700",
        hispanic: "#FFA500",
        whiteCombi: "#BDBDBD",
        notWhiteCombi: "#D3D3D3",
        blackCombi: "#FF1493",
        asianCombi: "#FFD700",
      };

      return colors[race];
    };

    // Set up the margins and dimensions for the chart
    this.margin = { top: 30, right: 30, bottom: 30, left: 40 };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    // Set up the scales for the x and y axes
    this.x = d3
      .scaleTime()
      .domain([new Date("1940-01-01"), new Date("2023-01-01")])
      .range([0, this.width]);

    this.y = d3.scaleLinear().domain([0, 100]).range([this.height, 0]);

    // Set up the line generator function
    this.line = d3
      .line()
      .x((d) => this.x(d.date))
      .y((d) => this.y(d.value));

    this.selector = selector;
    this.setup();
  }

  setup() {
    // Set up the SVG element
    this.svg = d3
      .select(this.selector)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // Draw the x and y axes
    this.svg
      .append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(this.x));

    this.svg
      .append("g")
      .call(d3.axisLeft(this.y))
      .append("text")
      .attr("class", "y-axis-title")
      .attr("y", -30)
      .attr("x", 0)
      .attr("fill", "white")
      .attr("dy", "1rem")
      .style("text-anchor", "middle")
      .text("Percentage");
  }

  updateGender(gender) {
    this.update(this.path, gender);
  }

  async update(path, gender = "Total") {
    this.path = path;
    this.gender = gender;
    this.data = await readCSVData(this.path, this.gender);

    const lines = this.svg.selectAll(".line").data(this.data, (d) => d.name);

    const linesEnter = lines.enter().append("path");

    linesEnter
      .merge(lines)
      .transition()
      .duration(1000)
      .attr("class", "line")
      .attr("d", (d) => this.line(d.values))
      .style("stroke", (d) => {
        return this.color(d.name);
      })
      .style("fill", "none");

    lines.exit().remove();

    const circleData = this.data
      .map(({ name, values }) =>
        values.map((value) => [value.date, value.value, name])
      )
      .flat();

    const circleEls = this.svg.selectAll("circle").data(circleData, (d) => d);

    const circleElsEnter = circleEls
      .enter()
      .append("circle")
      .attr("cx", (d) => this.x(d[0]))
      .attr("cy", (d) => this.y(d[1]))
      .attr("r", 0)
      .attr("fill", (d) => this.color(d[2]));

    circleElsEnter
      .merge(circleEls)
      .on("mouseover", function (d) {
        d3.select(this).transition().duration(200).attr("r", 6);
      })
      .on("mouseout", function (d) {
        d3.select(this).transition().duration(200).attr("r", 3);
      })
      .transition()
      .duration(1000)
      .attr("cx", (d) => this.x(d[0]))
      .attr("cy", (d) => this.y(d[1]))
      .attr("r", 3);

    circleEls.exit().transition().duration(1000).attr("r", 0).remove();

    document
      .querySelector(this.selector)
      .parentElement.querySelector(".legend-container")
      ?.remove();
    var legend = document.createElement("div");
    legend.classList.add("legend-container");

    for (let index = 0; index < Object.keys(RACES).length; index++) {
      const currentRace = Object.keys(RACES)[index];

      const legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");
      const rect = document.createElement("div");
      rect.classList.add("rectangle");
      rect.style.backgroundColor = this.color(currentRace);

      legendItem.addEventListener("click", (event) => {
        if (blockedRaces.includes(currentRace)) {
          blockedRaces.splice(blockedRaces.indexOf(currentRace), 1);
        } else {
          blockedRaces.push(currentRace);
        }

        legendItem.classList.toggle("unselected");
        this.update(this.path);
      });

      if (blockedRaces.includes(currentRace)) {
        legendItem.classList.add("unselected");
      }

      const label = document.createElement("div");
      label.classList.add("label");
      label.innerText = RACES[currentRace];

      legendItem.appendChild(rect);
      legendItem.appendChild(label);

      legend.appendChild(legendItem);
    }

    document.querySelector(this.selector).parentElement.appendChild(legend);
  }
}
