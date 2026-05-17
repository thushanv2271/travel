using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class DestinationService(IOptions<MongoDbSettings> settings)
{
    private readonly IMongoCollection<Destination> _col = MongoClientFactory
        .Create(settings.Value.ConnectionString)
        .GetDatabase(settings.Value.DatabaseName)
        .GetCollection<Destination>(settings.Value.DestinationsCollection);

    public async Task<List<Destination>> GetAllAsync() =>
        await _col.Find(_ => true).SortByDescending(d => d.CreatedAt).ToListAsync();

    public async Task<Destination?> GetByIdAsync(string id) =>
        await _col.Find(d => d.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Destination dest) { dest.CreatedAt = dest.UpdatedAt = DateTime.UtcNow; await _col.InsertOneAsync(dest); }

    public async Task UpdateAsync(string id, Destination dest) { dest.UpdatedAt = DateTime.UtcNow; await _col.ReplaceOneAsync(d => d.Id == id, dest); }

    public async Task DeleteAsync(string id) => await _col.DeleteOneAsync(d => d.Id == id);

    public async Task<long> CountAsync() => await _col.CountDocumentsAsync(_ => true);
}
