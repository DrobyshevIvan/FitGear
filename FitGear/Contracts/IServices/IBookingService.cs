using FitGear.Data;
using FitGear.Models.Booking;

namespace FitGear.Contracts;

public interface IBookingService
{
    Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto);
    Task<IEnumerable<GetBookingDto>> GetBookingsAsync();
    Task<GetBookingDto> GetBookingByIdAsync(int id);
    Task<bool> DeleteBookingAsync(int id);
    Task<bool> UpdateBookingAsync(int id, UpdateBookingDto updateBookingDto);
    Task<bool> BookingExistsAsync(int id);
}