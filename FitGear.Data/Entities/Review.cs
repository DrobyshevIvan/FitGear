namespace FitGear.Data;

public class Review
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string UserId { get; set; }
    public User User { get; set; }
    public int AnnouncementId { get; set; }
    public Announcement Announcement { get; set; }
}