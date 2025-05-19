using FitGear.Contracts;
using FitGear.Data;

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
        return _context.Announcements;
    }
}