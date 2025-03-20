using FitGear.Data;

namespace FitGear.Models.Booking;

public class BaseBookingDto
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public string Status { get; set; }
    public string UserId { get; set; } 
    public int AnnouncementId { get; set; }
}