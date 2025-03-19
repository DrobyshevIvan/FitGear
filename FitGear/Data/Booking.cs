namespace FitGear.Data;

public class Booking
{
    public int Id { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public string Status { get; set; }
    
    public string UserId { get; set; } 
    public User User { get; set; }
    public int AnnouncementId { get; set; }
    public Announcement Announcement { get; set; }
}