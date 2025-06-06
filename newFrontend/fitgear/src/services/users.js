import { api } from "../api/api";

export const getAllUsers = async (filter) => {
    try {
        const response = await api.get('/api/UserProfile', {
            params: {
                FirstName: filter?.search,
            }
        });
        return response.data || [];
    } catch (err) {
        console.log(err);
    }
}

export const getUserInfoById = async (id) => {
    try {
        const response = await api.get(`/api/UserProfile/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}
