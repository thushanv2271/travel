using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class UserService(IOptions<MongoDbSettings> dbSettings, IOptions<GoogleSettings> googleSettings)
{
    private readonly IMongoCollection<User> _col = MongoClientFactory
        .Create(dbSettings.Value.ConnectionString)
        .GetDatabase(dbSettings.Value.DatabaseName)
        .GetCollection<User>(dbSettings.Value.UsersCollection);

    private readonly string _googleClientId = googleSettings.Value.ClientId;

    public async Task<User?> FindByEmailAsync(string email) =>
        await _col.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> FindByGoogleIdAsync(string googleId) =>
        await _col.Find(u => u.GoogleId == googleId).FirstOrDefaultAsync();

    public async Task<(bool success, string error, User? user)> RegisterAsync(RegisterRequest req)
    {
        if (await FindByEmailAsync(req.Email) is not null)
            return (false, "An account with this email already exists.", null);

        var user = new User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Provider = "email",
            CreatedAt = DateTime.UtcNow
        };

        await _col.InsertOneAsync(user);
        return (true, string.Empty, user);
    }

    public async Task<(bool success, string error, User? user)> LoginAsync(UserLoginRequest req)
    {
        var user = await FindByEmailAsync(req.Email);
        if (user is null || user.PasswordHash is null)
            return (false, "Invalid email or password.", null);

        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return (false, "Invalid email or password.", null);

        return (true, string.Empty, user);
    }

    public async Task<(bool success, string error, User? user)> GoogleAuthAsync(string idToken)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_googleClientId]
            };
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch
        {
            return (false, "Invalid Google token.", null);
        }

        var user = await FindByGoogleIdAsync(payload.Subject)
                ?? await FindByEmailAsync(payload.Email);

        if (user is null)
        {
            user = new User
            {
                Name = payload.Name,
                Email = payload.Email,
                GoogleId = payload.Subject,
                Picture = payload.Picture,
                Provider = "google",
                CreatedAt = DateTime.UtcNow
            };
            await _col.InsertOneAsync(user);
        }
        else if (user.GoogleId is null)
        {
            // Link Google to existing email account
            await _col.UpdateOneAsync(
                u => u.Id == user.Id,
                Builders<User>.Update
                    .Set(u => u.GoogleId, payload.Subject)
                    .Set(u => u.Picture, payload.Picture)
            );
            user.GoogleId = payload.Subject;
            user.Picture = payload.Picture;
        }

        return (true, string.Empty, user);
    }
}
