import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_AVAILABLESLOTS } from "../../utils/queries";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isoWeek from "dayjs/plugin/isoWeek";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import "./BookingCalendar.css";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

const BookingCalendar = ({ escapeRoomId, duration, onSelectSlot }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("isoWeek")
  );
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("isoWeek"));
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);

  const workingHours = {
    start: 10,
    end: 22,
  };

  const generatePossibleSlots = () => {
    const slots = [];
    let currentTime = dayjs().hour(workingHours.start).minute(0).second(0);
    const endTime = dayjs().hour(workingHours.end).minute(0).second(0);

    while (currentTime.isBefore(endTime)) {
      const slotEndTime = currentTime.add(duration, "minute");
      if (slotEndTime.isAfter(endTime)) break;
      slots.push(currentTime.format("HH:mm:ss"));
      currentTime = currentTime.add(duration, "minute");
    }

    return slots;
  };

  const possibleSlots = generatePossibleSlots();

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeekStart.add(i, "day"));
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const { loading, error, data, refetch } = useQuery(QUERY_AVAILABLESLOTS, {
    variables: {
      escape_room_id: escapeRoomId,
      start_date: currentWeekStart.format("YYYY-MM-DD"),
      end_date: currentWeekStart.add(6, "day").format("YYYY-MM-DD"),
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && data.availableSlots) {
      const slotsByDate = {};
      data.availableSlots.forEach((slot) => {
        const date = dayjs(slot.date).format("YYYY-MM-DD");
        if (!slotsByDate[date]) {
          slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot.time);
      });
      setAvailableSlots(slotsByDate);

      const monday = currentWeekStart;
      setSelectedDate(monday);
      setSelectedDayOfWeek(0);
      setSelectedTime(null);
    }
  }, [data, currentWeekStart]);

  const handleNextWeek = () => {
    const newWeekStart = currentWeekStart.add(7, "day");
    setCurrentWeekStart(newWeekStart);
    refetch();
  };

  const handlePrevWeek = () => {
    const newWeekStart = currentWeekStart.subtract(7, "day");
    if (newWeekStart.isSameOrAfter(dayjs().startOf("isoWeek"))) {
      setCurrentWeekStart(newWeekStart);
      refetch();
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedDayOfWeek(date.diff(currentWeekStart, "day"));
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    if (selectedTime === time) {
      setSelectedTime(null);
      onSelectSlot({ date: null, time: null });
    } else {
      setSelectedTime(time);
      if (selectedDate) {
        onSelectSlot({
          date: selectedDate.format("YYYY-MM-DD"),
          time: time,
        });
      }
    }
  };

  const isSlotAvailable = (date, time) => {
    const dateStr = date.format("YYYY-MM-DD");
    const now = dayjs();
    const slotDateTime = dayjs(`${dateStr}T${time}`);
    if (slotDateTime.isBefore(now)) {
      return false;
    }
    return availableSlots[dateStr] && availableSlots[dateStr].includes(time);
  };

  if (error) {
    return (
      <div className="error-message">Error loading slots: {error.message}</div>
    );
  }

  return (
    <div className="booking-calendar-container">
      <div className="calendar-header">
        <button
          onClick={handlePrevWeek}
          className="nav-button"
          disabled={currentWeekStart.isSame(dayjs().startOf("isoWeek"))}
        >
          <ArrowLeft /> Prev Week
        </button>
        <h3>{currentWeekStart.format("MMMM YYYY")}</h3>
        <button onClick={handleNextWeek} className="nav-button">
          Next Week <ArrowRight />
        </button>
      </div>

      <div className="week-days-container">
        {weekDays.map((day) => (
          <div
            key={day.format("YYYY-MM-DD")}
            className={`day-header ${
              selectedDate && selectedDate.isSame(day, "day") ? "selected" : ""
            } ${day.isSame(dayjs(), "day") ? "today" : ""}`}
            onClick={() => handleDateSelect(day)}
          >
            <div className="day-name">{day.format("ddd")}</div>
            <div className="day-number">{day.format("D")}</div>
          </div>
        ))}
      </div>

      <div className="time-slots-grid">
        {possibleSlots.map((time) => {
          const isAvailable = isSlotAvailable(selectedDate, time);
          return (
            <button
              key={time}
              className={`time-slot ${!isAvailable ? "booked" : ""} ${
                selectedTime === time ? "selected" : ""
              }`}
              onClick={() => isAvailable && handleTimeSelect(time)}
              disabled={!isAvailable}
            >
              {dayjs(`2023-01-01T${time}`).format("HH:mm")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
