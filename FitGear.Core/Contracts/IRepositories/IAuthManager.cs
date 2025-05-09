using FitGear.Data;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace FitGear.Core.Contracts;

public interface IAuthManager
{
    Task<string> CreateRefreshToken(User user);
    Task<string> GenerateToken(User user);
    Task<User?> FindUserByRefreshToken(string refreshToken);
}