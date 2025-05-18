using FitGear.Core.Filters;
using FitGear.Data;

namespace FitGear.Core.Extenstions;

public static class AnnouncementExtensions
{
    public static IQueryable<Announcement> Filter(this IQueryable<Announcement> query,
        AnnouncementFilter announcementFilter)
    {
        if (!string.IsNullOrEmpty(announcementFilter.Title))
        {
            query = query.Where(a => a.Title.Contains(announcementFilter.Title));
        }
        
        if (!string.IsNullOrEmpty(announcementFilter.Description))
        {
            query = query.Where(a => a.Description.Contains(announcementFilter.Description));
        }

        return query;
    }
}