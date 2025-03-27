using FitGear.Data;

namespace FitGear.Contracts;

public interface IBookingRepository : IGenericRepository<Booking>
{
    Task<IEnumerable<Booking>> GetActiveBookingsAsync();
}