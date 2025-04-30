import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectBar } from "./components/ProjectBar.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { useCookies } from "react-cookie";

// Utility functions
import {
  downloadFile,
  handleGetFile,
  validateDates,
  handleFileUpload,
} from "./api/generateDumps.jsx"; // Adjust the path if necessary

export default function Home() {
  const [rawJson, setRawJson] = useState(null);
  const [dates, setDates] = useState({ day1: null, day2: null });
  const [buttonAvailable, setButtonAvailable] = useState(false);
  const [cookies] = useCookies(["token"]);
  const token = cookies["token"];
  const [fileData, setFileData] = useState({});
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const handleDateChange = (dayKey, date) => {
    const updatedDates = { ...dates, [dayKey]: date };
    setDates(updatedDates);

    validateDates(updatedDates, setButtonAvailable, token, () =>
      handleGetFile(
        token,
        setShowLoadingOverlay,
        handleWaitForDownload,
        toast.error,
      ),
    );
  };

  const handleWaitForDownload = (data) => {
    downloadFile(data, setFileData, toast);
  };

  const handleFileUploadWrapper = (event) => {
    if (!buttonAvailable) {
      toast.error("Please ensure both dates are valid and populated!");
      return;
    }

    handleFileUpload({
      event,
      dates,
      setRawJson,
      toast,
    });
  };
  return (
    <>
      <nav>
        <h1 className="text-2xl font-bold text-center py-4 m-2">BetterTime</h1>
        <label
          className={`scale-75 bg-background-accent-600 ${
            buttonAvailable
              ? "hover:bg-background-accent-500 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          } transition ease-in-out duration-150 active:bg-background-accent-400 font-bold py-2 px-4 rounded inline-flex items-center ml-auto`}
          htmlFor={"json_file_uploader"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>

          <span>Upload</span>
        </label>
        <input
          type="file"
          accept="application/json"
          onChange={handleFileUploadWrapper}
          multiple={false}
          id={"json_file_uploader"}
          style={{ display: "none" }}
          disabled={!buttonAvailable}
        />
        <p className={"-ml-1"}>Or</p>
        <button className="scale-75 bg-background-accent-600 transition ease-in-out duration-150 active:bg-background-accent-400 font-bold py-2 px-4 rounded inline-flex items-center hover:bg-background-accent-500 cursor-pointer">
          {token[0]["token"] == null ? (
            <a href="/login">Login</a>
          ) : (
            <a href="/login">Loged In</a>
          )}
        </button>
        <ToastContainer theme={"dark"} />
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
      {/* Project Bar */}
      <div className="flex flex-wrap w-[555px] h-full">
        <ErrorBoundary>
          <ResponsiveContainer width="100%" height={220} className="bg-bg-600">
            {rawJson ? (
              <ProjectBar data={rawJson} />
            ) : (
              <div>Upload A File!</div>
            )}
          </ResponsiveContainer>
        </ErrorBoundary>
      </div>
    </>
  );
}
