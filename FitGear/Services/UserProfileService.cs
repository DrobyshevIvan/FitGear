using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Contracts.IRepositories;
using FitGear.Core.Extenstions;
using FitGear.Core.Filters;
using FitGear.Data;
using FitGear.Models.Booking;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IMapper _mapper;

    public UserProfileService(IUserProfileRepository userProfileRepository,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        IMapper mapper)
    {
        _userProfileRepository = userProfileRepository;
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
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
    
    public async Task AssignRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var roleExists = await _roleManager.RoleExistsAsync(role);
        if (!roleExists)
            throw new InvalidOperationException($"Role '{role}' does not exist.");

        if (!await _userManager.IsInRoleAsync(user, role))
        {
            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                throw new InvalidOperationException("Failed to assign role");
        }
    }
    
    public async Task UpdateUserProfileAsync(string userId, UpdateUserProfileDto updateUserProfileDto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.FirstName = updateUserProfileDto.FirstName ?? user.FirstName;
        user.LastName = updateUserProfileDto.LastName ?? user.LastName;
        user.PhoneNumber = updateUserProfileDto.PhoneNumber ?? user.PhoneNumber;
        user.UserName = updateUserProfileDto.UserName ?? user.UserName;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException("Failed to update user profile");
        }
    }
    
    public async Task DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException("Failed to delete user");
        }
    }

    public async Task<UserDetailedProfileDto> GetUserByIdAsync(string userId)
    {
        var user = await _userProfileRepository.GetUserByIdIncludingConnectedTablesAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var userDto = _mapper.Map<UserDetailedProfileDto>(user);
        userDto.Roles = await _userManager.GetRolesAsync(user);
        return userDto;
    }
    
    public async Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(UserFilter userFilter)
    {
        var query = _userProfileRepository.GetQueryable();
        
        if (userFilter != null)
        {
            query = query.Filter(userFilter);
        }
        
        var users = await query.ToListAsync();
        return _mapper.Map<List<UserProfileDto>>(users);
    }
}