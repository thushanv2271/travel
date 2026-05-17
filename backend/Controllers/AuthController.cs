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
[Route("api/auth")]
public class AuthController(AdminUserService userService, IOptions<JwtSettings> jwtSettings) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!await userService.ValidateAsync(req.Username, req.Password))
            return Unauthorized(new { message = "Invalid username or password" });

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Value.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(jwtSettings.Value.ExpiryHours);

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Value.Issuer,
            audience: jwtSettings.Value.Audience,
            claims: [new Claim(ClaimTypes.Name, req.Username), new Claim(ClaimTypes.Role, "Admin")],
            expires: expires,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new LoginResponse(tokenString, req.Username, expires));
    }

    [HttpGet("verify")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Verify() => Ok(new { username = User.Identity?.Name, valid = true });
}
