using FitGear.Contracts;
using FitGear.Data;

namespace FitGear.Repository;

public class AnnouncementsRepository : GenericRepository<Announcement>, IAnnouncementsRepository
{
    public AnnouncementsRepository(FitGearDbContext context) : base(context)
    {
    }
}