const GRADES = [
  "None - 8th grade",
  "9th - 11th grade",
  "High school graduate",
  "Some college - no degree",
  "Associate's degree",
  "Bachelor's degree",
  "Master's degree",
  "Professional degree",
  "Doctoral degree",
];

async function readCSVData(path, gender) {
  return new Promise((resolve, reject) => {
    d3.dsv(";", path)
      .then((csvData) => {
        resolve(csvData);
      })
      .catch((e) => reject(e));
  });
}

export default class ColumnChart {
  margin;
  width;
  height;
  x0;
  x1;
  y;
  yAxis;
  color;

  constructor(selector) {
    this.selector = selector;
    // Define the dimensions of the SVG element
    (this.margin = { top: 30, right: 30, bottom: 30, left: 40 }),
      (this.width = 800 - this.margin.left - this.margin.right),
      (this.height = 600 - this.margin.top - this.margin.bottom);

    // Define the scales for the x and y axes
    this.x0 = d3.scaleBand().rangeRound([0, this.width]).paddingInner(0.1);

    this.x1 = d3.scaleBand().padding(0.05);

    this.y = d3.scaleLinear().range([this.height, 0]);

    // Define the colors for the bars
    this.color = d3.scaleOrdinal().range(["#4169E1", "#FF7F50"]);

    this.setup();
  }

  setup() {
    // Create the SVG element
    this.svg = d3
      .select(this.selector)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    this.yAxis = this.svg
      .append("g")
      .attr("class", "y-axis")
      .append("text")
      .attr("class", "y-axis-title")
      .attr("y", -30)
      .attr("x", 0)
      .attr("fill", "white")
      .attr("dy", "1rem")
      .style("text-anchor", "middle")
      .text("Percentage");
  }

  async update(type = "Total") {
    this.data = await this.loadData(type);

    // Set the domains for the scales
    this.x0.domain(
      this.data.map(function (d) {
        return d.category;
      })
    );
    this.x1.domain(["male", "female"]).rangeRound([0, this.x0.bandwidth()]);
    this.y.domain([
      0,
      d3.max(this.data, function (d) {
        return d3.max([d.male, d.female]);
      }),
    ]);

    // Add the bars for each category
    const categories = this.svg.selectAll(".category").data(this.data);

    const categoriesEnter = categories
      .enter()
      .append("g")
      .attr("class", "category")
      .attr("transform", (d) => {
        return "translate(" + this.x0(d.category) + ",0)";
      });

    categoriesEnter.merge(categories).transition().duration(1000);

    categories.exit().transition().duration(1000).remove();

    const bars = categories.selectAll("rect").data(function (d) {
      return [
        { gender: "male", value: d.male },
        { gender: "female", value: d.female },
      ];
    });

    const barEnter = bars
      .enter()
      .append("rect")
      .attr("x", (d) => {
        return this.x1(d.gender);
      })
      .attr("y", (d) => {
        return this.height;
      })
      .attr("fill", (d) => {
        return this.color(d.gender);
      })
      .attr("width", this.x1.bandwidth())
      .attr("height", function (d) {
        return 0;
      });

    barEnter
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("y", (d) => {
        return this.y(d.value);
      })
      .attr("height", (d) => {
        return this.height - this.y(d.value);
      });

    bars.exit().remove();

    // Add the x-axis
    this.svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x0))
      .selectAll(".x-axis text")
      .style("text-anchor", "middle")
      .attr("dx", "1.5em")
      .attr("dy", "0.5em")
      .attr("transform", "rotate(10)");

    this.svg
      .select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.y));

    document
      .querySelector(this.selector)
      .parentElement.querySelector(".legend-container")
      ?.remove();

    var legend = document.createElement("div");
    legend.classList.add("legend-container");

    const genders = ["male", "female"];

    for (let index = 0; index < genders.length; index++) {
      const legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");
      const rect = document.createElement("div");
      rect.classList.add("rectangle");
      rect.style.backgroundColor = this.color(genders[index]);

      const label = document.createElement("div");
      label.classList.add("label");
      label.innerText = genders[index];

      legendItem.appendChild(rect);
      legendItem.appendChild(label);

      legend.appendChild(legendItem);
    }

    document.querySelector(this.selector).parentElement.appendChild(legend);
  }

  async loadData(type = "Total") {
    const femaleData = await readCSVData("./data/gender/female.csv");
    const maleData = await readCSVData("./data/gender/male.csv");

    const foundFemaleDatum = femaleData.find(
      ({ Characteristic }) => type === Characteristic
    );
    const foundMaleDatum = maleData.find(
      ({ Characteristic }) => type === Characteristic
    );

    var data = GRADES.map((grade) => {
      const maleCount = Number(foundMaleDatum[grade].replace(".", "")) * 1000;
      const maleTotal = Number(foundMaleDatum["Total"].replace(".", "")) * 1000;
      const femaleCount =
        Number(foundFemaleDatum[grade].replace(".", "")) * 1000;
      const femaleTotal =
        Number(foundFemaleDatum["Total"].replace(".", "")) * 1000;

      return {
        category: grade,
        male: Math.floor((maleCount / maleTotal) * 100),
        female: Math.floor((femaleCount / femaleTotal) * 100),
      };
    });

    return data;
  }
}
