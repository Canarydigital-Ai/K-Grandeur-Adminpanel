import api from "../interceptors/axiosInterceptors";

// ✅ GET all bookings
export const getAllBookings = async () => {
  try {
    const response = await api.get("/booking-room");

    if (response.status === 200) {
      return Array.isArray(response.data) ? response.data : [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// ✅ GET booking by ID
export const getBookingById = async (id: string) => {
  try {
    const response = await api.get(`/booking-room/${id}`);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return null;
  }
};



// ✅ DELETE booking
export const deleteBooking = async (id: string) => {
  try {
    const response = await api.delete(`/booking-room/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};