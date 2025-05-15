using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using FitGear.Core.Contracts;
using FitGear.Data;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace FitGear.Repository;

public class AuthManager : IAuthManager
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthManager> _logger;
    private readonly FitGearDbContext _context;

    private const string _loginProvider = "FitGearApi";
    private const string _refreshToken = "RefreshToken";
    private const int REFRESH_TOKEN_EXPIRY_DAYS = 7;

    public AuthManager(IMapper mapper, 
        UserManager<User> userManager, 
        IConfiguration configuration,
        ILogger<AuthManager> logger,
        FitGearDbContext context)
    {
        _mapper = mapper;
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
        _context = context;
    }
    
    public async Task<string> CreateRefreshToken(User user)
    {
        await _userManager.RemoveAuthenticationTokenAsync(user, _loginProvider,
            _refreshToken);
        
        var randomNumber = new byte[32];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        
        var newRefreshToken = Convert.ToBase64String(randomNumber);
        var result = await _userManager.SetAuthenticationTokenAsync(user, _loginProvider,
            _refreshToken, newRefreshToken);
        
        if (!result.Succeeded)
        {
            throw new ApplicationException("Failed to create refresh token");
        }
        
        return newRefreshToken;
    }

    public async Task<string> GenerateToken(User user)
    {
        var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration
            ["JwtSettings:Key"]));

        var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);

        var roles = await _userManager.GetRolesAsync(user);
        var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x)).ToList();
        var userClaims = await _userManager.GetClaimsAsync(user);

        var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id)
            }
            .Union(userClaims).Union(roleClaims);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToInt32(_configuration["JwtSettings:DurationInMinutes"])),
            signingCredentials: credentials
            );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<User?> FindUserByRefreshToken(string refreshToken)
    {
        var userToken = await _context.Set<IdentityUserToken<string>>()
            .FirstOrDefaultAsync(t =>
                t.LoginProvider == _loginProvider &&
                t.Name == _refreshToken &&
                t.Value == refreshToken);

        if (userToken == null)
        {
            _logger.LogWarning($"No user found for provided refresh token");
            return null;
        }

        // Получить пользователя по userId
        var user = await _userManager.FindByIdAsync(userToken.UserId);
        return user;
    }
}