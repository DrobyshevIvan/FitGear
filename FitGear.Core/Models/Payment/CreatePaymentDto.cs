using FitGear.Data;
using FitGear.Data.Enums;

namespace FitGear.Models.Payment;

public class CreatePaymentDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string UserId { get; set; }
    public int BookingId { get; set; }
}