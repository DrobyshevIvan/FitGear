using FitGear.Data;
using FitGear.Models.Payment;

namespace FitGear.Contracts;

public interface IPaymentService
{
    Task<GetPaymentDto> CreatePaymentAsync(CreatePaymentDto paymentDto);
    Task<GetPaymentDto> ProcessPaymentAsync(int paymentId);
    Task<GetPaymentDto> GetPaymentAsync(int paymentId);
    Task<IEnumerable<GetPaymentDto>> GetUserPaymentsAsync(string userId);
    Task<Payment> RefundPaymentAsync(int paymentId);
    Task DeletePaymentAndBookingAsync(int paymentId);
}