using FitGear.Data.Enums;

namespace FitGear.Core.Filters;

public class BookingFilter
{
    public BookingStatus? Status { get; set; }
    public string? UserId { get; set; } 
    public int? AnnouncementId { get; set; }
}