import axios from "axios";

const API_URL = "http://localhost:5209/api/Category";

export const getAllCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addCategory = async (category) => {
    const response = await axios.post(API_URL, category);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}
