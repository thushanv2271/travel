namespace TaproTravels.Api.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string PackagesCollection { get; set; } = "packages";
    public string DestinationsCollection { get; set; } = "destinations";
    public string BookingsCollection { get; set; } = "bookings";
    public string InquiriesCollection { get; set; } = "inquiries";
    public string AdminUsersCollection { get; set; } = "admin_users";
    public string UsersCollection { get; set; } = "users";
}
