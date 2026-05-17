using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class AdminUserService(IOptions<MongoDbSettings> settings)
{
    private readonly IMongoCollection<AdminUser> _col = MongoClientFactory
        .Create(settings.Value.ConnectionString)
        .GetDatabase(settings.Value.DatabaseName)
        .GetCollection<AdminUser>(settings.Value.AdminUsersCollection);

    public async Task<AdminUser?> FindByUsernameAsync(string username) =>
        await _col.Find(u => u.Username == username).FirstOrDefaultAsync();

    public async Task<bool> ValidateAsync(string username, string password)
    {
        var user = await FindByUsernameAsync(username);
        return user is not null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task SeedDefaultAdminAsync()
    {
        var count = await _col.CountDocumentsAsync(_ => true);
        if (count == 0)
        {
            await _col.InsertOneAsync(new AdminUser
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Email = "admin@tapro.lk",
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
