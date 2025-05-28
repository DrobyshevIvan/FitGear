using FitGear.Contracts;
using FitGear.Core.Filters;
using FitGear.Services;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitGear.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileService _userProfileService;

    public UserProfileController(IUserProfileService userProfileService)
    {
        _userProfileService = userProfileService;
    }
    
    // GET: api/UserProfile/profile
    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> GetUserProfile()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if(userId == null)
        {
            return Unauthorized("User ID not found in claims.");
        }
        
        var userProfile = await _userProfileService.GetUserProfileAsync(userId);
        if (userProfile == null)
        {
            return NotFound("User profile not found.");
        }
        
        return Ok(userProfile);
    }
    
    // POST: api/UserProfile/{userId}/assign-role
    [HttpPost("{userId}/assign-role")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> AssignRole(string userId, [FromBody] string role)
    {
        await _userProfileService.AssignRoleAsync(userId, role);
        return Ok();
    }
    
    // PUT: api/UserProfile/profile
    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto updateUserProfileDto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (userId == null)
            return Unauthorized();

        await _userProfileService.UpdateUserProfileAsync(userId, updateUserProfileDto);
        return NoContent();
    }
    
    // DELETE: api/UserProfile/delete
    [HttpDelete("delete")]
    [Authorize]
    public async Task<IActionResult> DeleteOwnAccount()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (userId == null)
            return Unauthorized();
        
        await _userProfileService.DeleteUserAsync(userId);
        return NoContent();
    }
    
    // GET: api/UserProfile
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetAllUsers([FromQuery] UserFilter userFilter)
    {
        var users = await _userProfileService.GetAllUsersAsync(userFilter);
        return Ok(users);
    }
    
    // GET: api/UserProfile/{userId}
    [HttpGet("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<UserDetailedProfileDto>> GetUserById(string userId)
    {
        var user = await _userProfileService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        return Ok(user);
    }
    
    // DELETE api/UserProfile/{userId}
    [HttpDelete("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        await _userProfileService.DeleteUserAsync(userId);
        return NoContent();
    }
    
}