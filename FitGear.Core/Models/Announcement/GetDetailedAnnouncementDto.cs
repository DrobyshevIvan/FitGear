namespace FitGear.Models.Announcement;

public class GetDetailedAnnouncementDto : BaseAnnouncementDto
{
    public int Id { get; set; }
    public string CategoryName { get; set; }
    public double AverageRating { get; set; }
}