using System.Linq.Expressions;
using FitGear.Core.Filters;
using FitGear.Core.Pagination;
using FitGear.Core.Sorting;
using FitGear.Data;
using FitGear.Data.Enums;

namespace FitGear.Core.Extenstions;

public static class BookingExtensions
{
    public static IQueryable<Booking> Filter(this IQueryable<Booking> query,
        BookingFilter bookingFilter)
    {
        if (!string.IsNullOrEmpty(bookingFilter.UserId))
        {
            query = query.Where(b => b.UserId == bookingFilter.UserId);
        }

        if (!string.IsNullOrEmpty(bookingFilter.AnnouncementId.ToString()))
        {
            query = query.Where(b => b.AnnouncementId == bookingFilter.AnnouncementId);
        }
        
        if (bookingFilter.Status != null)
        {
            query = query.Where(b => b.Status == bookingFilter.Status);
        }
        return query;
    }

    // public static IQueryable<Announcement> Paginate(this IQueryable<Announcement> query, PageParams pageParams)
    // {
    //     var page = pageParams.Page ?? 1;
    //     var pageSize = pageParams.Size ?? 10;
    //
    //     return query.Skip((page - 1) * pageSize)
    //         .Take(pageSize);
    // }
    //
    // public static IQueryable<Announcement> Sort(this IQueryable<Announcement> query, SortParams sortParams)
    // {
    //     return sortParams.SortDirection == SortDirection.Descending 
    //         ? query.OrderByDescending(GetKeySelector(sortParams.OrderBy)) 
    //         : query.OrderBy(GetKeySelector(sortParams.OrderBy));
    // }
    //
    // private static Expression<Func<Announcement, object>> GetKeySelector(string? orderBy)
    // {
    //     if (string.IsNullOrEmpty(orderBy))
    //         return x => x.Title;
    //
    //     return orderBy switch
    //     {
    //         nameof(Announcement.Description) => x => x.Description,
    //         nameof(Announcement.CreatedAt) => x => x.CreatedAt,
    //         nameof(Announcement.PricePerDay) => x => x.PricePerDay,
    //         "Rating" => x => x.Reviews.Any() ? x.Reviews.Average(r => r.Rating) : 0,
    //         _ => x => x.Title
    //     };
    // }
}