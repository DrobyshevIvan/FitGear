using FitGear.Core.Filters;
using FitGear.Data;

namespace FitGear.Core.Extenstions;

public static class ReviewExtensions
{
    public static IQueryable<Review> Filter(this IQueryable<Review> query, ReviewFilter reviewFilter)
    {
        if(reviewFilter.Rating > 0)
        {
            query = query.Where(r => r.Rating == reviewFilter.Rating);
        }
        
        if (!string.IsNullOrEmpty(reviewFilter.Comment))
        {
            query = query.Where(r => r.Comment.Contains(reviewFilter.Comment));
        }
        
        if (reviewFilter.AnnouncementId > 0)
        {
            query = query.Where(r => r.AnnouncementId == reviewFilter.AnnouncementId);
        }
        
        return query;
    }
}