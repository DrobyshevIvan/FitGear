using FitGear.Core.Filters;
using FitGear.Data;

namespace FitGear.Core.Extenstions;

public static class UserExtensions
{
    public static IQueryable<User> Filter(this IQueryable<User> query,
        UserFilter bookingFilter)
    {
        if (!string.IsNullOrEmpty(bookingFilter.FirstName))
        {
            query = query.Where(u => u.FirstName.Contains(bookingFilter.FirstName));
        }

        if (!string.IsNullOrEmpty(bookingFilter.LastName))
        {
            query = query.Where(u => u.LastName.Contains(bookingFilter.LastName));
        }

        if (!string.IsNullOrEmpty(bookingFilter.Email))
        {
            query = query.Where(u => u.Email.Contains(bookingFilter.Email));
        }

        if (!string.IsNullOrEmpty(bookingFilter.PhoneNumber))
        {
            query = query.Where(u => u.PhoneNumber.Contains(bookingFilter.PhoneNumber));
        }

        if (bookingFilter.RegisteredFrom.HasValue)
        {
            query = query.Where(u => u.CreatedAt >= bookingFilter.RegisteredFrom.Value);
        }

        if (bookingFilter.RegisteredTo.HasValue)
        {
            query = query.Where(u => u.CreatedAt <= bookingFilter.RegisteredTo.Value);
        }

        return query;
    }
}