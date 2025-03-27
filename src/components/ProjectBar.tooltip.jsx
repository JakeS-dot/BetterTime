import PropTypes from "prop-types";

function secondsToTimestamp(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const minuets = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${minuets.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const ProjectBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // Filter out items with a value of 0
    const filteredPayload = payload
      .slice(0, -1)
      .filter((item) => item.value > 0);

    // Calculate the total time from filtered items
    const total = filteredPayload.reduce((acc, item) => acc + item.value, 0);

    return (
      <div
        style={{
          backgroundColor: "#5f5f72",
          padding: "10px",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        <p>{`Total: ${secondsToTimestamp(total)}`}</p>
        {filteredPayload.map((item, index) => {
          const seconds = item.value;
          const timestamp = secondsToTimestamp(seconds);
          return <p key={index}>{`${item.name}: ${timestamp}`}</p>;
        })}
      </div>
    );
  }
  return null;
};

ProjectBarTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProjectBarTooltip;
