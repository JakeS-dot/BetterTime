export function handleClick(dir) {
  if (dir === "forward") {
    return
  }
}
export const processData = (rawData) => {
  console.log(rawData)
  const projects = [
    {
      activity: "YouTube",
      segments: [
        { start: 2, end: 4 },
        { start: 8, end: 11 },
      ],
      total: "5h 0m",
    },
    {
      activity: "nvim",
      segments: [
        { start: 5, end: 9 },
      ],
      total: "4h 0m",
    },
    {
      activity: "BetterTim",
      segments: [
        { start: 16, end: 24 },
      ],
      total: "8h 0m",
    },
  ];

  const chartData = projects.map((project) => {
    const row = {
      activity: project.activity,
      total: project.total,
    };

    let lastEnd = 0;

    project.segments.forEach((seg, i) => {
      row[`offset${i}`] = seg.start - lastEnd;
      row[`duration${i}`] = seg.end - seg.start;

      lastEnd = seg.end;
    });

    return row;
  });

  const maxSegments = Math.max(...projects.map((p) => p.segments.length), 0);

  return [
    [true, false],               // disabled_arr
    ["Total Time", "Today"],      // timeText
    [chartData],                 // data (temp[2][0])
    [maxSegments]                // count (temp[3][0]) - This is the crucial fix!
  ];
};
