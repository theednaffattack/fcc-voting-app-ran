/*eslint-disable */
import React from "react";
import ReactFauxDOM from "react-faux-dom";
import * as d3 from "d3";

class SVGChart extends React.Component {
  render() {
    let data = this.props.data;
    console.log(JSON.stringify(data, null, 2));

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(x);

    const yAxis = d3
      .axisLeft()
      .scale(y)
      .ticks(data.length);

    // Create the element
    const div = new ReactFauxDOM.Element("div");

    // Pass it to d3.select and proceed as normal
    const svg = d3
      .select(div)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d.text));
    y.domain([0, d3.max(data, d => d.votesCount)]);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.text))
      .attr("width", 20)
      .attr("y", d => y(d.votesCount))
      .attr("height", d => {
        return height - y(d.votesCount);
      });

    // DOM manipulations done, convert to React
    return div.toReact();
  }
}

export default SVGChart;
/* eslint-enable */
