using AutoMapper;
using FitGear.Contracts;
using FitGear.Data;
using FitGear.Services;
using HotelListing.API.Core.Models.Users;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ILogger<UserController> _logger;
        private readonly SignInManager<User> _signInManager;
        private readonly LinkGenerator _linkGenerator;

        public UserController(IAccountService accountService,
            ILogger<UserController> logger,
            SignInManager<User> signInManager,
            LinkGenerator linkGenerator)
        {
            _accountService = accountService;
            _logger = logger;
            _signInManager = signInManager;
            _linkGenerator = linkGenerator;
        }

        // POST: api/User/register
        [HttpPost]
        [Route("register")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Register([FromBody] ApiUserDto apiUserDto)
        {
            _logger.LogInformation($"Registration Attempt for {apiUserDto.Email}");
            var errors = await _accountService.RegisterAsync(apiUserDto);

            if (errors.Any())
            {
                foreach (var error in errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return BadRequest(ModelState);
            }

            return Ok();
        }

        // POST: api/User/login
        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Login([FromBody] LoginDto loginDto)
        {
            _logger.LogInformation($"Login Attempt for {loginDto.Email}");
            var authResponse = await _accountService.LoginAsync(loginDto, HttpContext);
            if (authResponse == null)
            {
                return Unauthorized();
            }

            return Ok(authResponse);
        }

        // POST: api/User/refreshtoken
        [HttpPost]
        [Route("refreshtoken")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> RefreshToken([FromBody] AuthResponseDto request)
        {
            _logger.LogInformation($"Refresh Token Attempt for {request.UserId}");
            var authResponse = await _accountService.VerifyRefreshToken(request, HttpContext);
            if (authResponse == null)
            {
                return Unauthorized("Authorization failed");
            }

            return Ok(authResponse);
        }

        // GET: api/User/Roles
        [HttpGet]
        [Route("roles")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetRoles()
        {
            var roles = await _accountService.GetRolesFromRefreshToken(HttpContext);
            if (roles == null)
            {
                return NotFound("No roles found");
            }

            return Ok(roles.ToList());
        }

        // GET: api/User/login/google
        [HttpGet]
        [Route("login/google")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GoogleLogin([FromQuery] string returnUrl)
        {
            var redirectUrl = _linkGenerator.GetUriByAction(
                HttpContext,
                action: nameof(GoogleLoginCallback),
                controller: "User",
                values: new { returnUrl }
                );

            if (string.IsNullOrEmpty(redirectUrl))
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return Challenge(properties, [GoogleDefaults.AuthenticationScheme]);
        }

        // GET: api/User/login/google/callback
        [HttpGet]
        [Route("login/google/callback")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GoogleLoginCallback([FromQuery] string returnUrl)
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (result?.Succeeded != true)
            {
                return Unauthorized("Google authentication failed.");
            }

            await _accountService.LoginWithGoogleAsync(result.Principal, HttpContext);

            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return Redirect(returnUrl);
        }
    }
}
