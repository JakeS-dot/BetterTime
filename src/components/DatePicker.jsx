import { useLayoutEffect, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as DateRanges from "./DatePicker.process.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const DateRangePanel = ({ anchor, onClose, onSelectRange }) => {
  const panelRef = useRef(null);
  const [position, setPosition] = useState({ top: null, left: null });
  const [dates, setDates] = useState({ day1: null, day2: null });
  const [isVisible, setIsVisible] = useState("none");
  const handleDateChange = (dayKey, date) => {
    setDates((prev) => {
      const newDates = { ...prev, [dayKey]: date };

      // If both day1 and day2 are selected, send through onSelectRange
      if (newDates.day1 && newDates.day2) {
        // Use DateRanges.getCustomRange to wrap the dates and label
        const customRange = DateRanges.getCustomRange(
          newDates.day1,
          newDates.day2,
        );
        onSelectRange(customRange.start, customRange.end, customRange.label);
      }

      return newDates;
    });
  };

  useLayoutEffect(() => {
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchor]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  if (!position) return null; // skip first render entirely
  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-in",
      }}
      className="bg-background-900 p-6 rounded-lg shadow-lg"
    >
      <div className="flex gap-4">
        <div className="flex text-xs flex-col gap-2">
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getTodayRange();
              onSelectRange(start, end, "Day");
            }}
          >
            Today
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getYesterdayRange();
              onSelectRange(start, end, "Last Day");
            }}
          >
            Yesterday
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getLast7DaysRange();
              onSelectRange(start, end, "Last 7 Days");
            }}
          >
            Last 7 Days
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } =
                DateRanges.getLast7DaysFromYesterdayRange();
              onSelectRange(start, end, "Last 7 Days from Yesterday");
            }}
          >
            Last 7 Days from Yesterday
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getLast14DaysRange();
              onSelectRange(start, end, "Last 14 Days");
            }}
          >
            Last 14 Days
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getThisWeekRange();
              onSelectRange(start, end, "This Week");
            }}
          >
            This Week
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getLastWeekRange();
              onSelectRange(start, end, "Last Week");
            }}
          >
            Last Week
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getThisMonthRange();
              onSelectRange(start, end, "This Month");
            }}
          >
            This Month
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getLastMonthRange();
              onSelectRange(start, end, "Last Month");
            }}
          >
            Last Month
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              const { start, end } = DateRanges.getLast30DaysRange();
              onSelectRange(start, end, "Last 30 Days");
            }}
          >
            Last 30 Days
          </button>
          <button
            className="bg-background-800 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={() => {
              setIsVisible((prev) => (prev === "flex" ? "none" : "flex"));
            }}
          >
            Custom Range
          </button>

          <button
            className="bg-accent-700 hover:bg-primary-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col" style={{ display: isVisible }}>
          <div className="flex flex-wrap w-[33vw]">
            <div className="flex-row flex w-[33vw]">
              <div className="flex w-[33vw]">
                <DatePicker
                  open
                  className="w-[100%] bg-background-800 text-text-50"
                  selected={dates.day1}
                  onChange={(date) => handleDateChange("day1", date)}
                  selectsStart
                  startDate={dates.day1}
                  endDate={dates.day2}
                  dateFormat="yyyy-MM-dd"
                  placeholderText=" Pick a Date"
                  maxDate={new Date()}
                />

                <DatePicker
                  open
                  className="w-[100%] bg-background-800 text-text-50"
                  selected={dates.day2}
                  onChange={(date) => handleDateChange("day2", date)}
                  selectsEnd
                  startDate={dates.day1}
                  endDate={dates.day2}
                  minDate={dates.day1}
                  dateFormat="yyyy-MM-dd"
                  placeholderText=" Pick a Date"
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DateRangePanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectRange: PropTypes.func.isRequired,
  anchor: PropTypes.instanceOf(Element).isRequired,
};

export default DateRangePanel;
