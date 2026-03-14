import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CategoryBarTooltip from "./CategoryBar.tooltip.jsx";
import PropTypes from "prop-types";
import { processData } from "./CategoryBar.process.jsx";

export class CategoryBar extends React.Component {
  render() {
    const { data: rawData } = this.props;
    const temp = processData(rawData);
    const verticalData = temp[0][0];
    const horizontalData = temp[0][1];
    const colors = temp[1];
    const totalSeconds = Object.keys(horizontalData[0])
      .filter((k) => k !== "name")
      .reduce((sum, key) => sum + horizontalData[0][key], 0);
    return (
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart data={horizontalData} layout="vertical">
            <Tooltip content={<CategoryBarTooltip />} />
            <XAxis type="number" domain={[0, totalSeconds]} hide />
            <YAxis type="category" dataKey="name" hide />

            {Object.keys(horizontalData[0])
              .filter((k) => k !== "name")
              .map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="total"
                  fill={colors[i % colors.length]}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={verticalData} barGap={2}>
            <Tooltip content={<CategoryBarTooltip />} />
            <XAxis dataKey={"name"} tick={false} axisLine={false} />

            {Object.keys(verticalData[0] || {})
              .filter((key) => key !== "name")
              .map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[i % colors.length]}
                  stroke={colors[i % colors.length]}
                  strokeWidth={1.5}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
CategoryBar.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

