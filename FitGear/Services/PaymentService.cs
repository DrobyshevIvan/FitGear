using AutoMapper;
using FitGear.Contracts;
using FitGear.Data;
using FitGear.Data.Enums;
using FitGear.Models.Payment;

namespace FitGear.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMapper _mapper;
    private readonly IBookingRepository _bookingRepository;

    public PaymentService(IPaymentRepository paymentRepository, 
        IMapper mapper,
        IBookingRepository bookingRepository)
    {
        _paymentRepository = paymentRepository;
        _mapper = mapper;
        _bookingRepository = bookingRepository;
    }
    
    public async Task<GetPaymentDto> CreatePaymentAsync(CreatePaymentDto paymentDto)
    {
        var payment = _mapper.Map<Payment>(paymentDto);
        payment.Status = PaymentStatus.Pending;
        payment.CreatedAt = DateTime.UtcNow;
        
        var booking = await _bookingRepository.GetAsync(payment.BookingId);
        if(booking == null)
        {
            return null;
        }

        booking.Status = BookingStatus.Pending;
        await _bookingRepository.UpdateAsync(booking);
        
        await _paymentRepository.AddAsync(payment);
        
        return _mapper.Map<GetPaymentDto>(payment);
    }

    public async Task<GetPaymentDto> ProcessPaymentAsync(int paymentId)
    {
        var payment = await _paymentRepository.GetWithDetailsAsync(paymentId);
        if (payment == null)
        {
            // Log that the payment was not found
            return null;
        }
        
        payment.Status = PaymentStatus.Completed;
        
        var booking = await _bookingRepository.GetAsync(payment.BookingId);
        if (booking == null)
        {
            return null;
        }
        
        var now = DateTime.UtcNow;
        if (now < booking.From)
        {
            booking.Status = BookingStatus.Confirmed;
        }
        else if (now >= booking.From && now <= booking.To)
        {
            booking.Status = BookingStatus.Active;
        }
        else if (now > booking.To)
        {
            booking.Status = BookingStatus.Completed;
        }
        
        await _bookingRepository.UpdateAsync(booking);
        await _paymentRepository.UpdateAsync(payment);
        
        return _mapper.Map<GetPaymentDto>(payment);
    }

    public async Task<GetPaymentDto> GetPaymentAsync(int paymentId)
    {
        var payment = await _paymentRepository.GetWithDetailsAsync(paymentId);
        if (payment == null)
        {
            // Log that the payment was not found
            return null;
        }

        var getPaymentDto = _mapper.Map<GetPaymentDto>(payment);
        getPaymentDto.UserName = payment.User.FirstName + " " + payment.User.LastName;
        
        return getPaymentDto;
    }

    public async Task<IEnumerable<GetPaymentDto>> GetUserPaymentsAsync(string userId)
    {
        var payments = await _paymentRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<GetPaymentDto>>(payments);
    }

    public async Task<Payment> RefundPaymentAsync(int paymentId)
    {
        var payment = await _paymentRepository.GetWithDetailsAsync(paymentId);
        if (payment == null)
        {
            // Log that the payment was not found
            return null;
        }

        payment.Status = PaymentStatus.Refunded;

        var booking = await _bookingRepository.GetAsync(payment.BookingId);
        if (booking == null)
        {
            // Log that the booking was not found
            return null;
        }

        booking.Status = BookingStatus.Cancelled;

        await _bookingRepository.UpdateAsync(booking);
        await _paymentRepository.UpdateAsync(payment);

        return payment;
    }

    public async Task DeletePaymentAndBookingAsync(int paymentId)
    {
        var payment = await _paymentRepository.GetWithDetailsAsync(paymentId);
        if (payment == null)
        {
            // Log that the payment was not found
            return;
        }
        
        await _paymentRepository.DeleteAsync(paymentId);
        
        var booking = await _bookingRepository.GetAsync(payment.BookingId);
        if (booking != null)
        {
            await _bookingRepository.DeleteAsync(booking.Id);
        }
    }
}