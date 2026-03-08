import PropTypes from "prop-types";

function secondsToTimestamp(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const ProjectBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload
      .slice(0, -1)
      .filter((item) => item.value > 0);
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
        <strong className="underline">{`${label}`}</strong>
        <p>
          <strong>Total </strong>{" "}
          <span className="ml-5 float-right">{secondsToTimestamp(total)}</span>
        </p>
        {filteredPayload.map((item, index) => (
          <p key={index}>
            {item.name}{" "}
            <span className="ml-5 float-right">
              {secondsToTimestamp(item.value)}
            </span>
          </p>
        ))}
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
