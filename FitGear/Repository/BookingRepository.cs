using FitGear.Contracts;
using FitGear.Data;

namespace FitGear.Repository;

public class BookingRepository : GenericRepository<Booking>, IBookingRepository
{
    public BookingRepository(FitGearDbContext context) : base(context)
    {
    }
}