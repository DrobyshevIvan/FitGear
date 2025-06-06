import { api } from "../api/api";

export const getReviewsForAnnouncement = async (id) => {
    try {
        const response = await api.get('/api/Review', {
            params: {
                AnnouncementId: id,
            }
        }); 

        return response.data || [];
    } catch (err) {
        console.log(err);
    }
}

export const deleteReview = async (id) => {
    try {
        await api.delete(`/api/Review/${id}`);
    } catch (err) {
        console.log(err);
    }
}