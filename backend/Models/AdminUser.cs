using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaproTravels.Api.Models;

[BsonIgnoreExtraElements]
public class AdminUser
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string Username, DateTime ExpiresAt);
