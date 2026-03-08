import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Tooltip,
  XAxis,
} from "recharts";
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
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10 }}>
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
            <XAxis dataKey={"name"} tick={false} />
          </ComposedChart>{" "}
        </ResponsiveContainer>
      </>
    );
  }
}
ProjectBar.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};
