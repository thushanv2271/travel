using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class PackageService(IOptions<MongoDbSettings> settings)
{
    private readonly IMongoCollection<Package> _col = MongoClientFactory
        .Create(settings.Value.ConnectionString)
        .GetDatabase(settings.Value.DatabaseName)
        .GetCollection<Package>(settings.Value.PackagesCollection);

    public async Task<List<Package>> GetAllAsync() =>
        await _col.Find(_ => true).SortByDescending(p => p.CreatedAt).ToListAsync();

    public async Task<Package?> GetByIdAsync(string id) =>
        await _col.Find(p => p.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Package pkg) { pkg.CreatedAt = pkg.UpdatedAt = DateTime.UtcNow; await _col.InsertOneAsync(pkg); }

    public async Task UpdateAsync(string id, Package pkg) { pkg.UpdatedAt = DateTime.UtcNow; await _col.ReplaceOneAsync(p => p.Id == id, pkg); }

    public async Task DeleteAsync(string id) => await _col.DeleteOneAsync(p => p.Id == id);

    public async Task<long> CountAsync() => await _col.CountDocumentsAsync(_ => true);
}
