import React from "react";
import * as d3 from "d3";
import rd3 from "react-d3-library";
const RD3Component = rd3.Component;
// Our app
class CreateBox extends React.Component {
  svgRef = React.createRef(null);
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      svg: "",
    };
  }

  update() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(this.svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const data = [10, 14, 43, 0, 3];

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 50]).range([height, 0]);
    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .y(yScale);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((i) => i + 1);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append("g").call(xAxis).attr("transform", `translate(0,${height})`);
    svg.append("g").call(yAxis);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", "black");
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d, i) {
        return xScale(i);
      })
      .attr("cy", function (d, i) {
        return yScale(d);
      })
      .attr("r", 5);

    // // Add X axis --> it is a date format
    // var x = d3
    //   .scaleTime()
    //   .domain(
    //     d3.extent(data, function (d) {
    //       return d.date;
    //     })
    //   )
    //   .range([0, width]);
    // svg
    //   .append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));
    // // Add Y axis
    // var y = d3.scaleLinear().domain([8000, 9200]).range([height, 0]);
    // svg.append("g").call(d3.axisLeft(y));
    // // Add the line
    // svg
    //   .append("path")
    //   .datum(data)
    //   .attr("fill", "none")
    //   .attr("stroke", "#69b3a2")
    //   .attr("stroke-width", 1.5)
    //   .attr(
    //     "d",
    //     d3
    //       .line()
    //       .x(function (d) {
    //         return x(d.date);
    //       })
    //       .y(function (d) {
    //         return y(d.value);
    //       })
    //   );
    // // Add the points
    // svg
    //   .append("g")
    //   .selectAll("dot")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", function (d) {
    //     return x(d.date);
    //   })
    //   .attr("cy", function (d) {
    //     return y(d.value);
    //   })
    //   .attr("r", 5)
    //   .attr("fill", "#69b3a2");
  }
  componentDidMount() {
    this.update();
  }

  render() {
    return (
      <div>
        <svg ref={this.svgRef}></svg>
      </div>
    );
  }
}
export default CreateBox;
