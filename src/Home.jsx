import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectBar } from "./components/ProjectBar.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { useCookies } from "react-cookie";

export default function Home() {
  const [rawJson, setRawJson] = useState(null);
  const [dates, setDates] = useState({ day1: null, day2: null });
  const [buttonAvailable, setButtonAvailable] = useState(false);
  const token = useCookies(["token"]);


  const checkCache = () => {
    
  }
  // If the user is logged in pull the data dumps/check the cache for it
  const checkLogin = () => {
    if (token[0]["token"] == null) {
      checkCache();}
  const validateDates = (updatedDates) => {
    const { day1, day2 } = updatedDates;
    if (day1 && day2 && day2 > day1) {
      setButtonAvailable(true);
    } else {
      setButtonAvailable(false);
    }
  };
  
  const handleDateChange = (dayKey, date) => {
    const updatedDates = { ...dates, [dayKey]: date };
    setDates(updatedDates);
    validateDates(updatedDates);
  };

  const handleFileUpload = async (event) => {
    if (!buttonAvailable) {
      toast.error("Please ensure both dates are valid and populated!");
      return;
    }

    setRawJson(""); // Clear previous data
    const file = event.target.files[0];
    event.target.value = null; // Clear input value
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    await toast.promise(
      (async () => {
        try {
          const text = await file.text();
          let jsonData;
          try {
            jsonData = JSON.parse(text);
          } catch (parseError) {
            throw new Error(`JSON Parsing Error: ${parseError.message}`);
          }

          const response = await fetch("http://127.0.0.1:5000/process_json", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonData: jsonData,
              day1: dates.day1,
              day2: dates.day2,
            }),
          });

          if (!response.ok) {
            let errorMessage;
            switch (response.status) {
              case 401:
                errorMessage =
                  "KeyError: Missing or incorrect key in the JSON.";
                break;
              case 402:
                errorMessage =
                  "ValueError: Invalid value provided in the JSON.";
                break;
              case 403:
                errorMessage = "TypeError: Date does not exist in given JSON";
                break;
              default:
                errorMessage = `Unexpected Error (HTTP ${response.status}): ${await response.text()}`;
            }
            throw new Error(errorMessage);
          }

          const responseData = await response.json();
          setRawJson(JSON.stringify(responseData, null, 2));
        } catch (error) {
          toast.error(error.message);
          throw error;
        }
      })(),
      {
        pending: "Processing your file...",
        success: "File processed successfully!",
        error: "An error occurred while processing the file.",
      },
    );
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
          onChange={handleFileUpload}
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
          )}{" "}
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
            maxDate={new Date()} // Prevent selecting a future
          />
        </div>
        <div className="flex flex-col m-3">
          <label className="text-text">Day 2</label>
          <DatePicker
            selected={dates.day2}
            onChange={(date) => handleDateChange("day2", date)}
            dateFormat="yyyy-MM-dd"
            minDate={dates.day1} // Prevent selecting a date earlier than Day 1
            maxDate={new Date()} // Prevent selecting a future
          />
        </div>
      </div>
      {/* Project Bar */}
      <div className="flex flex-wrap w-[555px] h-full">
        <ErrorBoundary>
          <ResponsiveContainer
            width="100%"
            height={220}
            className={"bg-bg-600"}
          >
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
