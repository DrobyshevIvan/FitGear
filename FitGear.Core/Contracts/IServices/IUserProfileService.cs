using FitGear.Core.Filters;
using HotelListing.API.Core.Models.Users;

namespace FitGear.Contracts;

public interface IUserProfileService
{
    Task<UserProfileDto> GetUserProfileAsync(string userId);
    Task AssignRoleAsync(string userId, string role);
    Task UpdateUserProfileAsync(string userId, UpdateUserProfileDto updateUserProfileDto);
    Task DeleteUserAsync(string userId);
    Task<UserDetailedProfileDto> GetUserByIdAsync(string userId);
    Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(UserFilter userFilter);
}