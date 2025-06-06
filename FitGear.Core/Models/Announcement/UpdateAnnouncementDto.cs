namespace FitGear.Models.Announcement;

public class UpdateAnnouncementDto : BaseAnnouncementDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
}