using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using FitGear.Contracts;
using FitGear.Core.Contracts;
using FitGear.Data;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Identity;

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
        
        if(_userManager.FindByEmailAsync(_user.Email).Result != null)
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

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
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
        return new AuthResponseDto()
        {
            Token = token,
            UserId = _user.Id,
            RefreshToken = await _authManager.CreateRefreshToken(_user)
        };
    }
    
    public async Task<AuthResponseDto> VerifyRefreshToken(AuthResponseDto request)
    {
        var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        var tokenContent = jwtSecurityTokenHandler.ReadJwtToken(request.Token);
    
        // Если токен еще действителен
        if (tokenContent.ValidTo > DateTime.UtcNow)
        {
            return request;
        } 
        var username = tokenContent.Claims.ToList()
            .FirstOrDefault(q => q.Type == JwtRegisteredClaimNames.Email)?.Value;
        _user = await _userManager.FindByEmailAsync(username);

        if (_user == null || _user.Id != request.UserId)
        {
            return null;
        }
        
        var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);
        if (storedRefreshToken != request.RefreshToken)
        {
            return null;
        }
        // Удаляем старый refresh token
        await _userManager.RemoveAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);

        // Создаем новые токены
        var token = await _authManager.GenerateToken(_user);
        var newRefreshToken = await _authManager.CreateRefreshToken(_user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = _user.Id,
            RefreshToken = newRefreshToken
        };
    }
}