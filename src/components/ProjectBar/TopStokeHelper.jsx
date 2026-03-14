import PropTypes from "prop-types";

const StackEdgeBar = (props) => {
  const { x, y, width, height, fill, stroke, fillOpacity, payload, index } = props;

  // Determine if this is the top bar in the stack for this day
  const keys = Object.keys(payload).filter((k) => k !== "name" && k !== "comb");
  const isTop = index === keys.length - 1;

  // Optional: height of the vertical “step connector”
  const stepHeight = 4; // adjust as needed

  return (
    <g>
      {/* Bar fill */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={fillOpacity}
      />

      {/* Top horizontal line */}
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke={stroke}
        strokeWidth={1.5}
      />

      {/* Left vertical connector if not first day */}
      {payload.previousValue && (
        <line
          x1={x}
          y1={y - stepHeight} // slightly above top
          x2={x}
          y2={y + height}
          stroke={stroke}
          strokeWidth={1.5}
        />
      )}

      {/* Right vertical connector if top of stack */}
      {isTop && payload.nextValue && (
        <line
          x1={x + width}
          y1={y}
          x2={x + width}
          y2={y + stepHeight}
          stroke={stroke}
          strokeWidth={1.5}
        />
      )}
    </g>
  );
};

StackEdgeBar.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  fillOpacity: PropTypes.number,
  payload: PropTypes.object,
  dataKey: PropTypes.string,
  index: PropTypes.number,
};

export default StackEdgeBar;
