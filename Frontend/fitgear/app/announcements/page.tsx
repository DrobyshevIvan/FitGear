// app/announcements/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { Announcements } from "../components/Announcements";
import {
  CreateUpdateAnnouncement,
  Mode,
} from "../components/CreateUpdateAnnouncement";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "../services/announcements";

export default function AnnouncementsPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

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

  // Проверка наличия роли модератора или администратора
  const hasAdminOrModeratorRole = () => {
    if (!user || !Array.isArray(user.roles)) return false;
    return (
      user.roles.includes("Administrator") || user.roles.includes("Moderator")
    );
  };

  // Проверка аутентификации
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      message.error("Для просмотра этой страницы требуется вход в систему");
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Загрузка объявлений
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (isAuthenticated) {
        try {
          const data = await getAllAnnouncements();
          setAnnouncements(data);
        } catch (error) {
          message.error("Ошибка при загрузке объявлений");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();
  }, [isAuthenticated]);

  const handleCreateAnnouncement = async (
    request: CreateAnnouncementRequest
  ) => {
    if (!hasAdminOrModeratorRole()) {
      message.error("У вас нет прав для добавления объявлений");
      return;
    }

    try {
      await createAnnouncement(request);
      message.success("Объявление успешно создано");
      closeModal();
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      message.error("Ошибка при создании объявления");
      console.error(error);
    }
  };

  const handleUpdateAnnouncement = async (
    id: number,
    request: UpdateAnnouncementRequest
  ) => {
    if (!hasAdminOrModeratorRole()) {
      message.error("У вас нет прав для изменения объявлений");
      return;
    }

    try {
      await updateAnnouncement(id, request);
      message.success("Объявление успешно обновлено");
      closeModal();
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      message.error("Ошибка при обновлении объявления");
      console.error(error);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!hasAdminOrModeratorRole()) {
      message.error("У вас нет прав для удаления объявлений");
      return;
    }

    try {
      await deleteAnnouncement(id);
      message.success("Объявление успешно удалено");
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      message.error("Ошибка при удалении объявления");
      console.error(error);
    }
  };

  const openModal = () => {
    if (!hasAdminOrModeratorRole()) {
      message.error("У вас нет прав для добавления объявлений");
      return;
    }

    setMode(Mode.Create);
    setValues(defaultValues);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setValues(defaultValues);
    setIsModalOpen(false);
  };

  const openEditModal = (announcement: Announcement) => {
    if (!hasAdminOrModeratorRole()) {
      message.error("У вас нет прав для редактирования объявлений");
      return;
    }

    setMode(Mode.Edit);
    setValues(announcement);
    setIsModalOpen(true);
  };

  // Показываем загрузку во время проверки аутентификации
  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Если пользователь не авторизован, не рендерим содержимое
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* Показываем кнопку добавления только администраторам и модераторам */}
      {hasAdminOrModeratorRole() && (
        <Button onClick={openModal} type="primary" style={{ marginBottom: 16 }}>
          Добавить объявление
        </Button>
      )}

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
          showControls={hasAdminOrModeratorRole()} // Передаем флаг для отображения кнопок
        />
      )}
    </div>
  );
}
