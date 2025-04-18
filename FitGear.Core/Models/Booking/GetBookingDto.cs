using System.Text.Json.Serialization;
using FitGear.Data.Enums;

namespace FitGear.Models.Booking;

public class GetBookingDto : BaseBookingDto
{
    public int Id { get; set; }
    public string UserId { get; set; } 
    public int AnnouncementId { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BookingStatus Status { get; set; }
}