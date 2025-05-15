using FitGear.Contracts;
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
}