import React, { createContext, useContext, useEffect, useState } from "react";
import { QUERY_USERBOOKINGS } from "./queries";
import { CREATE_BOOKING, DELETE_BOOKING } from "./mutations";
import { useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";

const UserBookingsContext = createContext();

export const useUserBookingsContext = () => {
  return useContext(UserBookingsContext);
};

export const UserBookingsProvider = ({ children }) => {
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [deleteBooking] = useMutation(DELETE_BOOKING);

  const [userBookings, setUserBookings] = useState([]);

  const {
    loading,
    error,
    data: bookingsData,
    refetch,
  } = useQuery(QUERY_USERBOOKINGS);

  useEffect(() => {
    if (bookingsData) {
      const bookings = bookingsData?.getAllUserBookings || [];
      const formattedBookings = bookings.map((booking) => ({
        ...booking,
        date: dayjs(booking.date).format("MMMM D, YYYY"),
        time: booking.time.split(":").slice(0, 2).join(":"),
      }));

      setUserBookings(formattedBookings);
    }
  }, [bookingsData]);

  const createABooking = async (newBookingData) => {
    try {
      const response = await createBooking({
        variables: {
          escape_room_id: newBookingData.escape_room_id,
          numberOfPlayers: newBookingData.numberOfPlayers,
          date: newBookingData.date,
          time: newBookingData.time,
        },
      });

      if (response.data?.createBooking) {
        await refetch();
        return response.data.createBooking;
      }
      throw new Error("Booking creation failed");
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const deleteABooking = async (bookingId) => {
    try {
      const response = await deleteBooking({
        variables: { booking_id: bookingId },
      });

      if (response.data?.deleteBooking) {
        setUserBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
        return true;
      }
      throw new Error("Booking deletion failed");
    } catch (err) {
      console.error("Error deleting booking:", err);
      throw err;
    }
  };

  const value = {
    userBookings,
    setUserBookings,
    createABooking,
    deleteABooking,
    loading,
    error,
    refetch,
  };

  return (
    <UserBookingsContext.Provider value={value}>
      {children}
    </UserBookingsContext.Provider>
  );
};
