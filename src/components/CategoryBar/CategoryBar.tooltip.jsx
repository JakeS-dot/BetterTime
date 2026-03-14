import PropTypes from "prop-types";
import { secondsToTimestamp } from "../../tools/timeUtils.jsx"

const CategoryBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const filteredPayload = payload
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const title = label === "total" ? "Total Usage" : label;

  return (
    <div
      style={{
        backgroundColor: "#5f5f72",
        padding: "10px",
        borderRadius: "5px",
        color: "#fff",
        minWidth: "180px",
      }}
    >
      <strong className="underline block mb-1">
        {title}
      </strong>

      {filteredPayload.map((item, index) => (
        <p key={index}>
          <span style={{ color: item.color }}>●</span> {item.name}
          <span className="float-right ml-5">{secondsToTimestamp(item.value)}</span>
        </p>
      ))}
    </div>
  );
};

CategoryBarTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CategoryBarTooltip;
