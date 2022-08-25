import React from "react";
import * as d3 from "d3";
import rd3 from "react-d3-library";
const RD3Component = rd3.Component;
// Our app
class GraphicUser extends React.Component {
  svgRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      svg: "",
      data: this.props.data,
    };
    this.setGraphic = this.setGraphic.bind(this);
  }
  setGraphic() {
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 25, left: 30 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const data = this.state.data;
    const node = this.svgRef.current;
    //max
    var max = Math.max.apply(
      Math,
      data.map(function (o) {
        return o.value;
      })
    );
    max = max / 10;
    max = Math.ceil(max);
    max = max * 10;

    // append the svg object to the body of the page
    const container = d3
      .select(node)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Parse the Data
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((val) => val.name))
      .padding(0.2);
    container
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("class", "graphicUserText");
    // Add Y axis
    var y = d3.scaleLinear().domain([0, max]).range([height, 0]);
    container.append("g").call(d3.axisLeft(y));
    container
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.name);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      });
  }
  componentDidMount() {
    this.setGraphic();
  }

  render() {
    return (
      <div>
        <svg ref={this.svgRef} viewBox="0 0 460 400" id="graphicUser" />
      </div>
    );
  }
}
export default GraphicUser;
