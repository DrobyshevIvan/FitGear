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

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    const response = await fetch("http://localhost:5209/api/Announcements");
    const data = await response.json();

    // Извлекаем массив объявлений из поля $values
    return data.$values || [];
};

export const createAnnouncement = async (announcementRequest: CreateAnnouncementRequest) => {
    await fetch("http://localhost:5209/api/Announcements", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(announcementRequest),
    });
};

export const updateAnnouncement = async (id: number, announcementRequest: UpdateAnnouncementRequest) => {
    console.log("Updating announcement with ID:", id);
    console.log("Request body:", announcementRequest);

    const response = await fetch(`http://localhost:5209/api/Announcements/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(announcementRequest),
    });

    if (!response.ok) {
        throw new Error("Failed to update announcement");
    }
};

export const deleteAnnouncement = async (id: number) => {
    await fetch(`http://localhost:5209/api/Announcements/${id}`, {
        method: "DELETE",
    });
};