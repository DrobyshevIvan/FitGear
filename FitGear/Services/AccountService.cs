using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Contracts;
using FitGear.Data;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FitGear.Services;

public class AccountService : IAccountService
{
    private readonly IAuthManager _authManager;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly ILogger<AccountService> _logger;
    private User _user;

    private const string _loginProvider = "FitGearApi";
    private const string _refreshToken = "RefreshToken";

    public AccountService(IAuthManager authManager,
        UserManager<User> userManager,
        IMapper mapper,
        ILogger<AccountService> logger)
    {
        _authManager = authManager;
        _userManager = userManager;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<IdentityError>> RegisterAsync(ApiUserDto userDto)
    {
        _user = _mapper.Map<User>(userDto);

        if (_userManager.FindByEmailAsync(_user.Email).Result != null)
        {
            throw new Exception("User already exists");
        }

        _user.UserName = userDto.Email;

        var result = await _userManager.CreateAsync(_user, userDto.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(_user, "User");
        }

        return result.Errors;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, HttpContext httpContext)
    {
        _logger.LogInformation($"Looking for user with email {loginDto.Email}");
        _user = await _userManager.FindByEmailAsync(loginDto.Email);
        bool isValidUser = await _userManager.CheckPasswordAsync(_user, loginDto.Password);

        if (_user == null || isValidUser == false)
        {
            _logger.LogWarning($"User with email {loginDto.Email} was not found");
            return null;
        }

        var token = await _authManager.GenerateToken(_user);
        _logger.LogInformation($"Token generated for User with email {loginDto.Email} | Token: {token}");
        var refreshToken = await _authManager.CreateRefreshToken(_user);

        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(2)
        };
        httpContext.Response.Cookies.Append("X-Access-Token", token, accessTokenOptions);

        var refreshTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        httpContext.Response.Cookies.Append("X-Refresh-Token", refreshToken, refreshTokenOptions);

        return new AuthResponseDto()
        {
            UserId = _user.Id,
        };
    }

    public async Task<AuthResponseDto> VerifyRefreshToken(AuthResponseDto request, HttpContext httpContext)
    {
        try
        {
            var refreshToken = httpContext.Request.Cookies["X-Refresh-Token"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new KeyNotFoundException("Refresh token not found");
            }

            var accessToken = httpContext.Request.Cookies["X-Access-Token"];

            if (!string.IsNullOrEmpty(accessToken))
            {
                var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();

                // Проверяем, что токен валидный
                if (!jwtSecurityTokenHandler.CanReadToken(accessToken))
                {
                    _logger.LogWarning("Invalid token format");
                    return null;
                }

                var tokenContent = jwtSecurityTokenHandler.ReadJwtToken(accessToken);

                // Проверяем срок действия токена
                if (tokenContent.ValidTo > DateTime.UtcNow)
                {
                    return request;
                }
            }

            _user = await _authManager.FindUserByRefreshToken(refreshToken);

            var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);

            if (storedRefreshToken != refreshToken)
            {
                _logger.LogWarning("Refresh token mismatch");
                return null;
            }

            // Удаляем старый refresh token
            await _userManager.RemoveAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);

            // Создаем новые токены
            var token = await _authManager.GenerateToken(_user);
            var newRefreshToken = await _authManager.CreateRefreshToken(_user);

            var accessTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(2)
            };
            httpContext.Response.Cookies.Append("X-Access-Token", token, accessTokenOptions);

            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            httpContext.Response.Cookies.Append("X-Refresh-Token", newRefreshToken, refreshTokenOptions);

            // 5. Вернуть только нужную информацию (без токенов)
            return new AuthResponseDto
            {
                UserId = _user.Id
                // Можно добавить другие данные пользователя, если нужно
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying refresh token");
            return null;
        }
    }

    public async Task<IEnumerable<string>> GetRolesFromRefreshToken(HttpContext httpContext)
    {
        var refreshToken = httpContext.Request.Cookies["X-Refresh-Token"];
        _user = await _authManager.FindUserByRefreshToken(refreshToken);
        
        if (_user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        var roles = await _userManager.GetRolesAsync(_user);

        return roles;
    }
}