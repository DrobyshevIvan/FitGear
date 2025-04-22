using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace FitGear.Contracts;

public interface IAccountService
{
    Task<IEnumerable<IdentityError>> RegisterAsync(ApiUserDto userDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> VerifyRefreshToken(AuthResponseDto request);
}