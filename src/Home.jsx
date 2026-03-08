import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectBar } from "./components/ProjectBar.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { useCookies } from "react-cookie";

import { handleGetStats } from "./api/generateDumps.jsx";

export default function Home() {
  const [rawJson, setRawJson] = useState(null);
  const [dates, setDates] = useState({ day1: null, day2: null });
  const [cookies] = useCookies(["token"]);

  const token = cookies["token"]

  const handleDateChange = (dayKey, date) => {
    setDates((prev) => ({ ...prev, [dayKey]: date }));
  };

  useEffect(() => {
    const { day1, day2 } = dates;
    if (!day1 || !day2) return;
    if (day2 <= day1) return;
    if (!token) return;

    // Source - https://stackoverflow.com/a/4944782
    // Posted by David Hedlund
    // Retrieved 2026-03-08, License - CC BY-SA 2.5 
    // Modified for personal use
    const range = `${day1.getFullYear()}-${String(
      day1.getMonth() + 1
    ).padStart(2, "0")}`;

    const start = day1.toISOString().split("T")[0];
    const end = day2.toISOString().split("T")[0];


    handleGetStats(token, range, start, end, toast.error).then((data) => {
      if (data) setRawJson(data);
    });

  }, [dates, token]);

  return (
    <>
      <nav>
        <h1 className="text-2xl font-bold text-center py-4 m-2">
          BetterTime
        </h1>

        <button className="scale-75 bg-background-accent-600 transition ease-in-out duration-150 active:bg-background-accent-400 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-background-accent-500 cursor-pointer">
          {token ? (
            <a href="/login">Logged In</a>
          ) : (
            <a href="/login">Login</a>
          )}
        </button>

        <ToastContainer theme="dark" />
      </nav>

      <div className="flex flex-wrap w-1/2">
        <div className="flex flex-col m-3">
          <label className="text-text">Day 1</label>
          <DatePicker
            selected={dates.day1}
            onChange={(date) => handleDateChange("day1", date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
          />
        </div>

        <div className="flex flex-col m-3">
          <label className="text-text">Day 2</label>
          <DatePicker
            selected={dates.day2}
            onChange={(date) => handleDateChange("day2", date)}
            dateFormat="yyyy-MM-dd"
            minDate={dates.day1}
            maxDate={new Date()}
          />
        </div>
      </div>

      <div className="flex flex-wrap w-[555px] h-full">
        <ErrorBoundary>
          <ResponsiveContainer width="100%" height={220} className="bg-bg-600">
            {rawJson ? (
              <ProjectBar data={rawJson} />
            ) : (
              <div>nodata</div>
            )}
          </ResponsiveContainer>
        </ErrorBoundary>
      </div>
    </>
  );
}
