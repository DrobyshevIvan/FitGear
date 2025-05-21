import axios from "axios";

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllAnnouncements = async (filter) => {
  try {
    const headers = getAuthHeader();
    const response = await axios.get("http://localhost:5209/api/Announcements", { 
      params: {
        Title: filter?.search,
        OrderBy: filter?.orderItem,
        SortDirection: filter?.sortDirection,
      }
    });

    return response.data?.$values || [];
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw new Error("Не вдалося завантажити оголошення");
  }
};