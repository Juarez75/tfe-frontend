import React from "react";
import * as d3 from "d3";
import axios from "axios";
// Our app
var firstTime = true;
class GraphicSociety extends React.Component {
  svgRef = React.createRef(null);
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    const localeFR = fetch(
      "https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/fr-FR.json"
    )
      .then((d) => d.json())
      .then((locale) => {
        d3.timeFormatDefaultLocale(locale);
        this.componentDidUpdate();
      });
  }

  update() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 600 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(this.svgRef.current)
      .append("svg")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const data = this.props.dataGraph;

    var max = Math.max.apply(
      Math,
      data.map(function (o) {
        return o.value;
      })
    );
    max = max / 10;
    max = Math.ceil(max);
    max = max * 10;
    if (max == 0) max = 10;

    const xScale = d3
      .scaleTime()
      .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);
    const generateScaledLine = d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y(yScale);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${height})`)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    svg.append("g").call(yAxis);

    svg
      .selectAll(".line")
      .data(data)
      .join("path")
      .attr("d", (d) => generateScaledLine(d.value))
      .attr("fill", "none")
      .attr("stroke", "black");
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(new Date(d.date));
      })
      .attr("cy", function (d) {
        return yScale(d.value);
      })
      .attr("r", 5);
  }
  componentDidMount() {
    this.update();
  }
  componentDidUpdate() {
    d3.select(this.svgRef.current).selectAll("*").remove();
    this.update();
  }

  render() {
    return (
      <div>
        <svg ref={this.svgRef} viewBox="0 0 600 230"></svg>
      </div>
    );
  }
}
export default GraphicSociety;
