import { api } from "../api/api";

export const getAllAnnouncements = async (filter) => {
  try {
    const response = await api.get("/api/Announcements", { 
      params: {
        Title: filter.search || "",  
        OrderBy: filter?.orderItem,
        SortDirection: filter?.sortDirection,
        size: filter.size || 20,
        page: filter.page || 1,
      }
    });

    return response.data?.$values || [];
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
  }
};

export const addAnnouncement = async (data) => {
  try {
    await api.post("/api/Announcements", {
      title: data.title,
      Description: data.description,
      quantityAvailable: data.quantity,
      pricePerDay: data.price,
      categoryId: data.categoryId,
    });
    return true;
  } catch (err) {
    console.log("addAnnouncement error:", err);
    return false;
  }
}

export const removeAnnouncement = async (id) => {
  try {
    await api.delete(`/api/Announcements/${id}`);
  } catch (err) {
    console.log("addAnnouncement error:", err);
  }
}

export const getAnnouncementById = async (id) => {
  try {
    const response = await api.get(`/api/Announcements/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export const updateAnnouncement = async (id, data) => {
  try {
    await api.put(`/api/Announcements/${id}`, {
      title: data.title,
      description: data.description,
      quantityAvailable: data.quantity,
      pricePerDay: data.price,
      id: id,
    });
  } catch (err) {
    console.log(err);
  }
}