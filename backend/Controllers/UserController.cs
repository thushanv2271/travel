using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaproTravels.Api.Models;
using TaproTravels.Api.Services;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(UserService userService, IOptions<JwtSettings> jwtSettings) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var (success, error, user) = await userService.RegisterAsync(req);
        if (!success) return BadRequest(new { message = error });
        return Ok(BuildTokenResponse(user!));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest req)
    {
        var (success, error, user) = await userService.LoginAsync(req);
        if (!success) return Unauthorized(new { message = error });
        return Ok(BuildTokenResponse(user!));
    }

    [HttpPost("google")]
    public async Task<IActionResult> Google([FromBody] GoogleAuthRequest req)
    {
        var (success, error, user) = await userService.GoogleAuthAsync(req.IdToken);
        if (!success) return Unauthorized(new { message = error });
        return Ok(BuildTokenResponse(user!));
    }

    private UserLoginResponse BuildTokenResponse(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Value.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(jwtSettings.Value.ExpiryHours);

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Value.Issuer,
            audience: jwtSettings.Value.Audience,
            claims: [
                new Claim(ClaimTypes.NameIdentifier, user.Id ?? string.Empty),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, "User")
            ],
            expires: expires,
            signingCredentials: creds
        );

        return new UserLoginResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            user.Name,
            user.Email,
            user.Picture,
            expires
        );
    }
}
