import { api } from "../api/api";

export const getReviewsForAnnouncement = async () => {
    try {
        const response = await api.get('/api/Review'); 
        return response.data?.values || [];
    } catch (err) {
        console.log(err);
    }
}