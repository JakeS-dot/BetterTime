import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectBar } from "./components/ProjectBar.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import DateRangePanel from "./components/DatePicker.jsx";
import { handleGetStats } from "./api/getStats.jsx";
import { getTotalTime } from "./components/totalTime.jsx"
import { useCookies } from "react-cookie"

const toLocalDateString = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [rawJson, setRawJson] = useState(null);
  const [dates, setDates] = useState({ day1: null, day2: null });
  const [dateRangeText, setDateRangeText] = useState("Last 7 Days");
  const [showDatePanel, setShowDatePanel] = useState(false);
  const triggerRef = useRef(null);
  const [userDataCookie] = useCookies(['userData']);

  useEffect(() => {
    if (userDataCookie["userData"]) {
      setLoggedIn(true)
    }
    // Source - https://stackoverflow.com/a/4944782
    // Posted by David Hedlund
    // Retrieved 2026-03-08, License - CC BY-SA 2.5
    // Modified for personal use

    const { day1, day2 } = dates;

    const startDay =
      day1 ||
      (() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - 6);
        return d;
      })();

    const endDay = day2 || (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    })();
    const range = `${endDay.getFullYear()}-${String(
      endDay.getMonth() + 1,
    ).padStart(2, "0")}`;
    const start = toLocalDateString(startDay);
    const end = toLocalDateString(endDay);
    loggedIn && handleGetStats(range, start, end, setLoggedIn, toast.error).then((data) => {
      if (data) setRawJson(data);
    });
  }, [dates, loggedIn, userDataCookie]);

  return (
    <>
      <nav className="flex justify-between items-center max-h-[7vh] bg-background-900">
        <h1 className="text-2xl font-bold text-center py-4 m-2">BetterTime</h1>
        <button className="scale-75 bg-accent-600 transition ease-in-out duration-150 active:bg-accent-400 font-bold py-3 px-5 rounded inline-flex items-center hover:bg-accent-500 cursor-pointer">
          {loggedIn ? <a href="/login">Logged In</a> : <a href="/login">Login</a>}
        </button>
      </nav>

      <ToastContainer theme="dark" />
      <ErrorBoundary>
        <h1 className="text-3xl m-2 mb-8">
          <strong>{getTotalTime({ data: rawJson })}</strong> over the{" "}
          <span
            ref={triggerRef}
            className="cursor-pointer underline text-accent-500"
            onClick={() => setShowDatePanel(true)}
          >
            {dateRangeText}
          </span>
          {showDatePanel && triggerRef.current && (
            <DateRangePanel
              anchor={triggerRef.current}
              onClose={() => setShowDatePanel(false)}
              onSelectRange={(start, end, label) => {
                setDates({ day1: start, day2: end });
                setDateRangeText(label);
                setShowDatePanel(false);
              }}
            />
          )}
        </h1>
      </ErrorBoundary>
      <div className="grid grid-cols-2 aspect-[2/1] gap-4 m-2 [&>*]:bg-background-850 [&>*]:p-4 [&>*]:h-[200px]">
        <div className="h-[200px]">
          <ErrorBoundary>
            {rawJson ? <ProjectBar data={rawJson} /> : <div>nodata</div>}
          </ErrorBoundary>
        </div>

        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
      </div>
    </>
  );
}
