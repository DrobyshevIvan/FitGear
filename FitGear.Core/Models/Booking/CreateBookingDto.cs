using FitGear.Models.Announcement;

namespace FitGear.Models.Booking;

public class CreateBookingDto : BaseBookingDto
{
    public string UserId { get; set; } 
    public int AnnouncementId { get; set; }
}