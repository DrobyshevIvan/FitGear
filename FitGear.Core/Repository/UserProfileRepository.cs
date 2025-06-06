using FitGear.Core.Contracts.IRepositories;
using FitGear.Data;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Repository;

public class UserProfileRepository : GenericRepository<User>, IUserProfileRepository
{
    private readonly FitGearDbContext _context;

    public UserProfileRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
    
    public IQueryable<User> GetQueryable()
    {
        return _context.Users;
    }

    public async Task<User?> GetUserByIdIncludingConnectedTablesAsync(string userId)
    {
        return await _context.Users
            .Include(u => u.Bookings)
            .Include(u => u.Payments)
            .Include(u => u.Reviews)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }
}