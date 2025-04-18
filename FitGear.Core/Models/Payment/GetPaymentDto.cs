using FitGear.Data;
using FitGear.Data.Enums;

namespace FitGear.Models.Payment;

public class GetPaymentDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public string UserId { get; set; }
    public int BookingId { get; set; }
    public string UserName { get; set; }
}