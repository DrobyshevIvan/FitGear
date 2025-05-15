import axios from "axios";

export interface CreateAnnouncementRequest {
    title: string;
    description: string;
    quantityAvailable: number;
    pricePerDay: number;
}

export interface UpdateAnnouncementRequest {
    id: number;
    title: string;
    description: string;
    quantityAvailable: number;
    pricePerDay: number;
}

// Вспомогательная функция для получения токена
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    const authHeaders = getAuthHeader();
    const headers = { ...authHeaders } as Record<string, string>;
    
    const response = await fetch("http://localhost:5209/api/Announcements", {
        headers
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch announcements");
    }
    
    const data = await response.json();
    return data.$values || [];
};

export const createAnnouncement = async (request: CreateAnnouncementRequest) => {
    return axios.post(
        "http://localhost:5209/api/Announcements",
        request,
        { withCredentials: true }
    );
};

export const updateAnnouncement = async (id: number, request: UpdateAnnouncementRequest) => {
    console.log("Updating announcement with ID:", id);
    console.log("Request body:", request);

    const authHeaders = getAuthHeader();
    const headers = {
        "content-type": "application/json",
        ...authHeaders
    } as Record<string, string>;

    return axios.put(
        `http://localhost:5209/api/Announcements/${id}`,
        request,
        { withCredentials: true }
    );
};

export const deleteAnnouncement = async (id: number) => {
    const authHeaders = getAuthHeader();
    const headers = { ...authHeaders } as Record<string, string>;
    
    return axios.delete(
        `http://localhost:5209/api/Announcements/${id}`,
        { withCredentials: true }
    );
};