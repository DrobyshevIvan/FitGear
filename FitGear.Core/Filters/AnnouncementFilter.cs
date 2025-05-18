namespace FitGear.Core.Filters;

public class AnnouncementFilter
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public decimal? PricePerDay { get; set; }

}