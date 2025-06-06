using FitGear.Contracts;
using FitGear.Data;
using FitGear.Data.Enums;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Repository;

public class BookingRepository : GenericRepository<Booking>, IBookingRepository
{
    private readonly FitGearDbContext _context;

    public BookingRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetActiveBookingsAsync()
    {
        var now = DateTime.UtcNow;
        return await _context.Bookings
            .Where(b => (b.Status == BookingStatus.Confirmed && b.From <= now) ||
                        (b.Status == BookingStatus.Active && b.To < now))
            .ToListAsync();
    }
    
    public IQueryable<Booking> GetQueryable()
    {
        return _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Announcement);
    }
}