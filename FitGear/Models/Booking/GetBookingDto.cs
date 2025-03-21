namespace FitGear.Models.Booking;

public class GetBookingDto : BaseBookingDto
{
    public int Id { get; set; }
    public string UserId { get; set; } 
    public int AnnouncementId { get; set; }
}