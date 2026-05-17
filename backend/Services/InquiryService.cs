using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaproTravels.Api.Models;
using TaproTravels.Api.Settings;

namespace TaproTravels.Api.Services;

public class InquiryService(IOptions<MongoDbSettings> settings)
{
    private readonly IMongoCollection<Inquiry> _col = MongoClientFactory
        .Create(settings.Value.ConnectionString)
        .GetDatabase(settings.Value.DatabaseName)
        .GetCollection<Inquiry>(settings.Value.InquiriesCollection);

    public async Task<List<Inquiry>> GetAllAsync() =>
        await _col.Find(_ => true).SortByDescending(i => i.CreatedAt).ToListAsync();

    public async Task<Inquiry?> GetByIdAsync(string id) =>
        await _col.Find(i => i.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Inquiry inquiry) { inquiry.CreatedAt = DateTime.UtcNow; await _col.InsertOneAsync(inquiry); }

    public async Task MarkReadAsync(string id) =>
        await _col.UpdateOneAsync(i => i.Id == id, Builders<Inquiry>.Update.Set(i => i.IsRead, true));

    public async Task DeleteAsync(string id) => await _col.DeleteOneAsync(i => i.Id == id);

    public async Task<long> CountUnreadAsync() => await _col.CountDocumentsAsync(i => !i.IsRead);
}
