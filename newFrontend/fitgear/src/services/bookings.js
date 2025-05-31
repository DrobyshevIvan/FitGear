import axios from "axios";

const API_URL = "http://localhost:5209/api/Bookings"

export const getAllBookings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}