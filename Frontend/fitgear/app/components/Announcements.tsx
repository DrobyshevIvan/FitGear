// app/components/Announcements.tsx
import { CardTitle } from "./Cardtitle";
import Card from "antd/es/card/Card";
import Button from "antd/es/button/button";

interface Props {
  announcements: Announcement[];
  handleDelete: (id: number) => void;
  handleOpen: (announcement: Announcement) => void;
  showControls?: boolean; // Новое свойство для контроля отображения кнопок
}

export const Announcements = ({
  announcements,
  handleDelete,
  handleOpen,
  showControls = true, // По умолчанию кнопки будут видны
}: Props) => {
  return (
    <div className="cards">
      {announcements.map((announcement: Announcement) => (
        <Card
          key={announcement.id}
          title={
            <CardTitle
              title={announcement.title}
              pricePerDay={announcement.pricePerDay}
            />
          }
          bordered={false}
        >
          <p>{announcement.description}</p>
          {showControls && (
            <div className="card__buttons">
              <Button
                onClick={() => handleOpen(announcement)}
                style={{ flex: 1 }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(announcement.id)}
                danger
                style={{ flex: 1 }}
              >
                Delete
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};