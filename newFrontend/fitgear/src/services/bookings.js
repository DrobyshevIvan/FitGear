import axios from "axios";

const API_URL = "http://localhost:5209/api/Bookings"

export const getAllBookings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export const deleteBooking = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data;
}

export const editBooking = async (updatedData) => {
    const response = await axios.put(`${API_URL}/${updatedData.id}`, updatedData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.data;
}