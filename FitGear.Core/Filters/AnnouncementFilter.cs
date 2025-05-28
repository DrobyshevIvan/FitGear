namespace FitGear.Core.Filters;

public class AnnouncementFilter
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Category { get; set; }
    
    public decimal? MinPricePerDay { get; set; }
    public decimal? MaxPricePerDay { get; set; }
    public bool? IsDeleted { get; set; }
}