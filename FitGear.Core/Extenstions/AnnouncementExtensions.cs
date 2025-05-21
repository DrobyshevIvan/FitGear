using System.Linq.Expressions;
using FitGear.Core.Filters;
using FitGear.Core.Pagination;
using FitGear.Core.Sorting;
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

        if (announcementFilter.MinPricePerDay.HasValue)
        {
            query = query.Where(a => a.PricePerDay >= announcementFilter.MinPricePerDay);
        }

        if (announcementFilter.MaxPricePerDay.HasValue)
        {
            query = query.Where(a => a.PricePerDay <= announcementFilter.MaxPricePerDay);
        }

        return query;
    }

    public static IQueryable<Announcement> Paginate(this IQueryable<Announcement> query, PageParams pageParams)
    {
        var page = pageParams.Page ?? 1;
        var pageSize = pageParams.Size ?? 10;

        return query.Skip((page - 1) * pageSize)
            .Take(pageSize);
    }

    public static IQueryable<Announcement> Sort(this IQueryable<Announcement> query, SortParams sortParams)
    {
        return sortParams.SortDirection == SortDirection.Descending 
            ? query.OrderByDescending(GetKeySelector(sortParams.OrderBy)) 
            : query.OrderBy(GetKeySelector(sortParams.OrderBy));
    }

    private static Expression<Func<Announcement, object>> GetKeySelector(string? orderBy)
    {
        if (string.IsNullOrEmpty(orderBy))
            return x => x.Title;

        return orderBy switch
        {
            nameof(Announcement.Description) => x => x.Description,
            nameof(Announcement.CreatedAt) => x => x.CreatedAt,
            nameof(Announcement.PricePerDay) => x => x.PricePerDay,
            _ => x => x.Title
        };
    }
}