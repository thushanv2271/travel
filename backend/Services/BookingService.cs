using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class BookingService(IOptions<MongoDbSettings> settings)
{
    private readonly IMongoCollection<Booking> _col = MongoClientFactory
        .Create(settings.Value.ConnectionString)
        .GetDatabase(settings.Value.DatabaseName)
        .GetCollection<Booking>(settings.Value.BookingsCollection);

    public async Task<List<Booking>> GetAllAsync() =>
        await _col.Find(_ => true).SortByDescending(b => b.CreatedAt).ToListAsync();

    public async Task<Booking?> GetByIdAsync(string id) =>
        await _col.Find(b => b.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Booking booking) { booking.CreatedAt = DateTime.UtcNow; await _col.InsertOneAsync(booking); }

    public async Task UpdateStatusAsync(string id, string status) =>
        await _col.UpdateOneAsync(b => b.Id == id, Builders<Booking>.Update.Set(b => b.Status, status));

    public async Task DeleteAsync(string id) => await _col.DeleteOneAsync(b => b.Id == id);

    public async Task<long> CountAsync() => await _col.CountDocumentsAsync(_ => true);

    public async Task<long> CountByStatusAsync(string status) =>
        await _col.CountDocumentsAsync(b => b.Status == status);
}
