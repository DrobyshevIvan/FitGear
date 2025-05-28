using FitGear.Contracts;
using FitGear.Data;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Repository;

public class AnnouncementsRepository : GenericRepository<Announcement>, IAnnouncementsRepository
{
    private readonly FitGearDbContext _context;

    public AnnouncementsRepository(FitGearDbContext context) : base(context)
    {
        _context = context;
    }
    
    public IQueryable<Announcement> GetQueryable()
    {
        return _context.Announcements
            .Include(a => a.Category);
    }

    public async Task<Announcement> GetAsyncIncludingCategory(int id)
    {
        return await _context.Announcements
            .Include(a => a.Category)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}