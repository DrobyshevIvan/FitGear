"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import { Announcements } from "../components/Announcements";
import { CreateUpdateAnnouncement, Mode } from "../components/CreateUpdateAnnouncement";
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
} from "../services/announcements";

export default function AnnouncementsPage() {
    const defaultValues = {
        id: 0,
        title: "",
        description: "",
        quantityAvailable: 0,
        pricePerDay: 1,
    } as Announcement;

    const [values, setValues] = useState<Announcement>(defaultValues);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getAllAnnouncements();
            setAnnouncements(data);
            setLoading(false);
        };

        fetchAnnouncements();
    }, []);

    const handleCreateAnnouncement = async (request: CreateAnnouncementRequest) => {
        await createAnnouncement(request);
        closeModal();
        const data = await getAllAnnouncements();
        setAnnouncements(data);
    };

    const handleUpdateAnnouncement = async (id: number, request: UpdateAnnouncementRequest) => {
        await updateAnnouncement(id, request);
        closeModal();
        const data = await getAllAnnouncements();
        setAnnouncements(data);
    };

    const handleDeleteAnnouncement = async (id: number) => {
        await deleteAnnouncement(id);
        const data = await getAllAnnouncements();
        setAnnouncements(data);
    };

    const openModal = () => {
        setMode(Mode.Create);
        setValues(defaultValues);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    const openEditModal = (announcement: Announcement) => {
        setMode(Mode.Edit);
        setValues(announcement);
        setIsModalOpen(true);
    };

    return (
        <div>
            <Button onClick={openModal}>Добавить объявление</Button>

            <CreateUpdateAnnouncement
                mode={mode}
                values={values}
                isModalOpen={isModalOpen}
                handleCreate={handleCreateAnnouncement}
                handleUpdate={handleUpdateAnnouncement}
                handleCancel={closeModal}
            />

            {loading ? (
                <Title>Загрузка...</Title>
            ) : (
                <Announcements
                    announcements={announcements}
                    handleDelete={handleDeleteAnnouncement}
                    handleOpen={openEditModal}
                />
            )}
        </div>
    );
}