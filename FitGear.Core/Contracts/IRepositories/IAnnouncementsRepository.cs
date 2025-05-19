using FitGear.Data;

namespace FitGear.Contracts;

public interface IAnnouncementsRepository : IGenericRepository<Announcement>
{
    IQueryable<Announcement> GetQueryable();
}