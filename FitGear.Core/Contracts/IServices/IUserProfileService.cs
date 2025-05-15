using HotelListing.API.Core.Models.Users;

namespace FitGear.Contracts;

public interface IUserProfileService
{
    Task<UserProfileDto> GetUserProfileAsync(string userId);
}