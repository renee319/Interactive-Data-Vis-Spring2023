async function readCSVData(path, gender) {
  return new Promise((resolve, reject) => {
    d3.dsv(";", path)
      .then((csvData) => {
        resolve(csvData);
      })
      .catch((e) => reject(e));
  });
}
export default class PieChart {
  width;
  height;
  radius;
  svg;
  g;
  color;
  pie;
  path;
  label;

  constructor(selector) {
    this.selector = selector;
    this.width = 600;
    this.height = 600;
    this.radius = Math.min(this.width, this.height) / 2;
    this.innerRadius = 0;
    this.padAngle = Math.PI / 180;
    this.cornerRadius = 4;
    this.outerRadius = this.radius - 10;

    this.svg = d3
      .select(selector)
      .attr("width", this.width)
      .attr("height", this.height);

    this.viz = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );

    this.color = d3.scaleOrdinal([
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf",
    ]);

    this.setup();
  }

  setup() {
    this.arc = d3
      .arc()
      .cornerRadius(this.cornerRadius)
      .innerRadius(this.innerRadius)
      .padAngle(this.padAngle)
      .outerRadius(this.outerRadius);
  }

  async update(
    category = "Occupation (Employed Civilians Only)",
    gender = "Total",
    grade = "Total"
  ) {
    this.data = await this.loadData(category, gender, grade);
    this.sum = this.data.reduce((acc, value) => acc + value.value, 0);

    const arcs = d3.pie().value((d) => d.value)(this.data);

    const pieViz = this.viz.selectAll("g.slice").data(arcs, (d) => {
      return "" + d.data.value + d.data.label + d.index;
    });

    const pieEnter = pieViz
      .enter()
      .append("g")
      .attr("class", "slice")
      .each(function (d) {
        this._current = d;
      });

    pieEnter
      .append("path")
      .attr("fill", (d, index) => {
        return this.color(d.data.label);
      })
      .transition()
      .duration(2500)
      .attrTween("d", (d) => {
        var interpolate = d3.interpolate(this._current, {
          startAngle: d.startAngle,
          endAngle: d.startAngle,
        });
        var _this = this;
        return (t) => {
          _this._current = interpolate(t);
          return this.arc(_this._current);
        };
      });

    pieEnter
      .append("text")
      .attr("fill", "cyan")
      .attr("transform", (d, i) => {
        const points = this.arc.centroid(d);
        return `translate(${points[0] * 1.75},${points[1] * 1.75})`;
      })
      .style("text-anchor", "middle")
      .text((d) => {
        return `${Math.floor((d.data.value / this.sum) * 100)}%`;
      });

    const pieUpdate = pieEnter.merge(pieViz);

    pieUpdate
      .selectAll("path")
      .transition()
      .duration(2500)
      .attrTween("d", (d) => {
        var interpolate = d3.interpolate(this._current, {
          startAngle: d.startAngle,
          endAngle: d.endAngle,
        });
        var _this = this;
        return function (t) {
          _this._current = interpolate(t);
          return _this.arc(_this._current);
        };
      });

    pieUpdate
      .selectAll("text")
      .attr("transform", (d, i) => {
        const points = this.arc.centroid(d);
        return `translate(${points[0] * 1.75},${points[1] * 1.75})`;
      })
      .text((d) => `${Math.floor((d.data.value / this.sum) * 100)}%`);

    const pieExit = pieViz.exit().remove();

    document
      .querySelector(this.selector)
      .parentElement.querySelector(".legend-container")
      ?.remove();

    var legend = document.createElement("div");
    legend.classList.add("legend-container");

    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];

      const legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");
      const rect = document.createElement("div");
      rect.classList.add("rectangle");
      rect.style.backgroundColor = this.color(element.label);
      const label = document.createElement("div");
      label.classList.add("label");
      label.innerText = element.label;

      legendItem.appendChild(rect);
      legendItem.appendChild(label);

      legend.appendChild(legendItem);
    }

    document.querySelector(this.selector).parentElement.appendChild(legend);
  }

  async loadData(
    category = "Occupation (Employed Civilians Only)",
    gender = "Total",
    grade = "Total"
  ) {
    const data = [];
    const femaleData = await readCSVData("./data/gender/female.csv");
    const maleData = await readCSVData("./data/gender/male.csv");

    const foundFemaleDatum = femaleData.filter(
      ({ Category }) => Category === category
    );
    const foundMaleDatum = maleData.filter(
      ({ Category }) => Category === category
    );

    if (gender === "Male") {
      for (let index = 0; index < foundFemaleDatum.length; index++) {
        const element = foundFemaleDatum[index];
        data.push({
          label: element.Characteristic,
          value: Number(element[grade].replace(".", "")),
        });
      }
    } else if (gender === "Female") {
      for (let index = 0; index < foundMaleDatum.length; index++) {
        const element = foundMaleDatum[index];
        data.push({
          label: element.Characteristic,
          value: Number(element[grade].replace(".", "")),
        });
      }
    } else {
      for (let index = 0; index < foundMaleDatum.length; index++) {
        const maleElement = foundMaleDatum[index];
        const femaleElement = foundFemaleDatum[index];

        data.push({
          label: maleElement.Characteristic,
          value:
            Number(maleElement[grade].replace(".", "")) +
            Number(femaleElement[grade].replace(".", "")),
        });
      }
    }

    return data;
  }
}
