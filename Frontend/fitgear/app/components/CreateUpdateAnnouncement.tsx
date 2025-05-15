import { Modal } from "antd";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "../services/announcements";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  mode: Mode;
  values: Announcement;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleCreate: (request: CreateAnnouncementRequest) => void;
  handleUpdate: (id: number, request: UpdateAnnouncementRequest) => void;
}

export enum Mode {
  Create,
  Edit,
}

export const CreateUpdateAnnouncement = ({
  mode,
  values,
  isModalOpen,
  handleCancel,
  handleCreate,
  handleUpdate,
}: Props) => {
  const { hasRole } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantityAvailable, setQuantityAvailable] = useState<number>(0);
  const [pricePerDay, setPricePerDay] = useState<number>(1);

  useEffect(() => {
    if (!hasRole("Moderator")) {
      router.push("/unauthorized");
      return;
    }

    setTitle(values.title);
    setDescription(values.description);
    setQuantityAvailable(values.quantityAvailable);
    setPricePerDay(values.pricePerDay);
  }, [values, hasRole, router]);

  const handleOnOk = async () => {
    if (!hasRole("Moderator")) {
      return;
    }

    if (mode === Mode.Create) {
      const announcementRequest: CreateAnnouncementRequest = {
        title,
        description,
        quantityAvailable,
        pricePerDay,
      };
      handleCreate(announcementRequest);
    } else if (mode === Mode.Edit) {
      const announcementRequest: UpdateAnnouncementRequest = {
        id: values.id,
        title,
        description,
        quantityAvailable,
        pricePerDay,
      };
      handleUpdate(values.id, announcementRequest);
    }
  };

  if (!hasRole("Moderator")) {
    return null;
  }

  return (
    <Modal
      title={
        mode === Mode.Create
          ? "Добавить объявление"
          : "Редактировать объявление"
      }
      open={isModalOpen}
      cancelText={"Отмена"}
      onOk={handleOnOk}
      onCancel={handleCancel}
    >
      <div className="book__modal">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
        />
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 3 }}
          placeholder="Описание"
        />
        <Input
          value={quantityAvailable}
          onChange={(e) => setQuantityAvailable(Number(e.target.value))}
          type="number"
          placeholder="Количество"
        />
        <Input
          value={pricePerDay}
          onChange={(e) => setPricePerDay(Number(e.target.value))}
          type="number"
          placeholder="Цена за день"
        />
      </div>
    </Modal>
  );
};
