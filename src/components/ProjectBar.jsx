import React from "react";
import { ComposedChart, Bar, Line, Tooltip, XAxis } from "recharts";
import ProjectBarTooltip from "./ProjectBar.tooltip.jsx";
import PropTypes from "prop-types";
import { processData } from "./ProjectBar.process.jsx";

export class ProjectBar extends React.Component {
  render() {
    const { data: rawData } = this.props;
    const temp = processData(rawData); // Process the data here
    const data = temp[0];
    const colors = temp[1];
    return (
      <>
        <ComposedChart
          width={550}
          height={220}
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <Tooltip content={<ProjectBarTooltip />} />
          {Object.keys(data[0])
            .filter((key) => key !== "name" && key !== "comb")
            .map((key, i) => (
              <Bar
                key={i}
                dataKey={key}
                stackId="b"
                fill={colors[i % colors.length]}
                fillOpacity={0.3}
                stroke={colors[i % colors.length]}
                strokeWidth={1.5}
                strokeOpacity={1}
              />
            ))}
          <Line
            type="monotone"
            dataKey="comb"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
          />
          <XAxis dataKey={"date"} />
        </ComposedChart>
      </>
    );
  }
}
ProjectBar.propTypes = {
  data: PropTypes.string.isRequired,
};
