using FitGear.Data.Enums;

namespace FitGear.Data;

public class Payment
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string UserId { get; set; }
    public User User { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; }
}