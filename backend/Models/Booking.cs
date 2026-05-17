using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaproTravels.Api.Models;

public class Booking
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string PackageId { get; set; } = string.Empty;
    public string PackageTitle { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime TravelDate { get; set; }
    public int Passengers { get; set; } = 1;
    public string PickupLocation { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "pending";
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
