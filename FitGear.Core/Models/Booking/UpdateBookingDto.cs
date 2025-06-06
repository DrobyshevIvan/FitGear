using FitGear.Data.Enums;

namespace FitGear.Models.Booking;

public class UpdateBookingDto : BaseBookingDto
{
    public int Id { get; set; }
    public BookingStatus Status { get; set; }
}