using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaproTravels.Api.Models;

[BsonIgnoreExtraElements]
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? GoogleId { get; set; }
    public string Provider { get; set; } = "email";
    public string? Picture { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public record RegisterRequest(string Name, string Email, string Password);
public record UserLoginRequest(string Email, string Password);
public record GoogleAuthRequest(string IdToken);
public record UserLoginResponse(string Token, string Name, string Email, string? Picture, DateTime ExpiresAt);
