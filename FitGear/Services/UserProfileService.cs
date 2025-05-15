using FitGear.Contracts;
using FitGear.Core.Contracts.IRepositories;
using FitGear.Data;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace FitGear.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly UserManager<User> _userManager;

    public UserProfileService(IUserProfileRepository userProfileRepository,
        UserManager<User> userManager)
    {
        _userProfileRepository = userProfileRepository;
        _userManager = userManager;
    }
    
    public async Task<UserProfileDto> GetUserProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        
        var userProfileDto = new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToList()
        };

        return userProfileDto;
    } 
}