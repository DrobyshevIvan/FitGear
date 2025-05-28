namespace FitGear.Models.Announcement;

public class BaseAnnouncementDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int QuantityAvailable { get; set; }
    public decimal PricePerDay { get; set; }
    public int IsDeleted { get; set; }
    public string Url { get; set; }
}