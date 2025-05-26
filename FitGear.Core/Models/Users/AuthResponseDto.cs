using FitGear.Data;
using Microsoft.AspNetCore.Identity;

namespace HotelListing.API.Core.Models.Users;

public class AuthResponseDto
{
    public string? UserId { get; set; }
    public string? accessToken { get; set; }
    public string? refreshToken { get; set; }
}