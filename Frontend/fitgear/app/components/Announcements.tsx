import { CardTitle } from "./Cardtitle";
import Card from "antd/es/card/Card";
import Button from "antd/es/button/button";

interface Props {
  announcements: Announcement[];
  handleDelete: (id: number) => void;
  handleOpen: (announcement: Announcement) => void;
}

export const Announcements = ({
  announcements,
  handleDelete,
  handleOpen,
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
        </Card>
      ))}
    </div>
  );
};
