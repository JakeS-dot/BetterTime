import React from "react";
import PropTypes from "prop-types";
import { processData, handleClick } from "./DurationsChart.process";
import { stringToNeonColor } from "../../tools/stringToColor";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export class DurationsChart extends React.Component {
  render() {
    const { data: rawData } = this.props;
    const temp = processData(rawData);
    const disabled_arr = temp[0];
    const timeText = temp[1];
    const data = temp[2][0];
    const maxSegments = temp[3][0];

    const chartHeight = data.length * 25 + 100;
    const longestLabel = data.reduce((max, d) => {
      return d.activity.length > max.length ? d.activity : max;
    }, "");
    const yAxisWidth = Math.max(60, longestLabel.length * 7);
    const hours = Array.from({ length: 25 }, (_, i) => i);

    return (
      <>
        <div className="flex items-center justify-center">
          <button
            onClick={handleClick("back")}
            disabled={disabled_arr[0]}
            className="mr-2 enabled:fill-background-500 disabled:fill-background-100 rounded-full size-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              {/*<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->*/}
              <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM335 199C344.4 189.6 359.6 189.6 368.9 199C378.2 208.4 378.3 223.6 368.9 232.9L281.9 319.9L368.9 406.9C378.3 416.3 378.3 431.5 368.9 440.8C359.5 450.1 344.3 450.2 335 440.8L231 337C221.6 327.6 221.6 312.4 231 303.1L335 199z" />
            </svg>
          </button>
          <div className="text-lg text-center">
            <span className="text-text-100 font-bold">{timeText[0]}</span>{" "}
            <span>{timeText[1]}</span>
          </div>
          <button
            onClick={handleClick("forward")}
            disabled={disabled_arr[1]}
            className=" ml-2 disabled:fill-background-100 enabled:fill-background-500 rounded-full size-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              {/* <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->*/}
              <path d="M64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM305 441C295.6 450.4 280.4 450.4 271.1 441C261.8 431.6 261.7 416.4 271.1 407.1L358.1 320.1L271.1 233.1C261.7 223.7 261.7 208.5 271.1 199.2C280.5 189.9 295.7 189.8 305 199.2L409 303C418.4 312.4 418.4 327.6 409 336.9L305 441z" />
            </svg>
          </button>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart layout="vertical" data={data} margin={{ right: 12 }}>
              <ReferenceLine x={0} stroke="#5F5F5F" strokeWidth={1} />
              <ReferenceLine
                ifoverflow={"visible"}
                x="24"
                position="end"
                stroke="#5F5F5F"
              />

              {data.map((entry, index) => (
                <ReferenceLine
                  key={index}
                  y={entry.activity}
                  stroke="#5F5F5F"
                  position="end"
                  ifOverflow="visible"
                />
              ))}
              <XAxis
                type="number"
                domain={[0, 24]}
                ticks={hours}
                fontSize={13}
                interval={0}
                allowDataOverflow={false}
                orientation="top"
                tickFormatter={(hour) => {
                  const h = hour % 24;
                  const suffix = h < 12 ? "a" : "p";
                  const formatted = h % 12 === 0 ? 12 : h % 12;

                  return `${formatted}${suffix}`;
                }}
              />
              <YAxis
                type="category"
                dataKey="activity"
                width={yAxisWidth + 100}
                axisLine={false}
                tickLine={false}
                tick={({ x, y, index }) => {
                  const item = data[index];

                  return (
                    <g transform={`translate(${x}, ${y})`}>
                      <text
                        x={-yAxisWidth - 20}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#888"
                      >
                        {item.activity.length > 9
                          ? item.activity.slice(0, 8) + "..."
                          : item.activity}
                      </text>

                      <text
                        x={-65}
                        y={0}
                        dy={4}
                        textAnchor="start"
                        fill="#E6E6E6"
                      >
                        {item.total}
                      </text>
                    </g>
                  );
                }}
              />

              <Tooltip />
              {Array.from({ length: maxSegments }).map((_, i) => (
                <React.Fragment key={i}>
                  <Bar dataKey={`offset${i}`} stackId="a" fill="transparent" isAnimationActive={false} />

                  <Bar dataKey={`duration${i}`} stackId="a" isAnimationActive={false}>
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={"#" + stringToNeonColor(entry.activity)}
                      />
                    ))}
                  </Bar>
                </React.Fragment>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }
}
DurationsChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};
