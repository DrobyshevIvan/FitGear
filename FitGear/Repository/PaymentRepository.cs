using FitGear.Contracts;
using FitGear.Data;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Repository;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    private readonly FitGearDbContext _context;

    public PaymentRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Payment>> GetByUserIdAsync(string userId)
    {
        return await _context.Payments
            .Include(p => p.Booking)
            .Include(p => p.User)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Payment> GetWithDetailsAsync(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.Booking)
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
        {
            throw new KeyNotFoundException($"Payment with id {id} not found.");
        }

        return payment;
    }
}