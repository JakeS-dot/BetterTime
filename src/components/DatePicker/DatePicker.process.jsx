//
// Date range helpers
//

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const today = () => startOfDay(new Date());

//
// Ranges
//

export const getTodayRange = () => {
  const t = today();
  return { start: t, end: t, label: "Today" };
};

export const getYesterdayRange = () => {
  const y = today();
  y.setDate(y.getDate() - 1);
  return { start: y, end: y, label: "Yesterday" };
};

export const getLast7DaysRange = () => {
  const end = today();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return { start, end, label: "Last 7 Days" };
};

export const getLast7DaysFromYesterdayRange = () => {
  const end = today();
  end.setDate(end.getDate() - 1);

  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return { start, end, label: "Last 7 Days (from Yesterday)" };
};

export const getLast14DaysRange = () => {
  const end = today();
  const start = new Date(end);
  start.setDate(end.getDate() - 13);
  return { start, end, label: "Last 14 Days" };
};

export const getLast30DaysRange = () => {
  const end = today();
  const start = new Date(end);
  start.setDate(end.getDate() - 29);
  return { start, end, label: "Last 30 Days" };
};

export const getThisWeekRange = () => {
  const end = today();
  const start = new Date(end);

  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + mondayOffset);

  return { start, end, label: "This Week" };
};

export const getLastWeekRange = () => {
  const now = today();

  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + mondayOffset - 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end, label: "Last Week" };
};

export const getThisMonthRange = () => {
  const now = today();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end: now, label: "This Month" };
};

export const getLastMonthRange = () => {
  const now = today();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start, end: startOfDay(end), label: "Last Month" };
};

export const getCustomRange = (day1, day2) => {
  const start = startOfDay(day1);
  const end = startOfDay(day2);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayCount = Math.round((end - start) / millisecondsPerDay) + 1;

  return { start, end, label: `Past ${dayCount} Days` };
};
