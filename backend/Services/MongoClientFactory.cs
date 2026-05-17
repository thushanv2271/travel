using MongoDB.Driver;
using System.Net.Security;
using System.Security.Authentication;

namespace TaproTravels.Api.Services;

public static class MongoClientFactory
{
    public static MongoClient Create(string connectionString)
    {
        var settings = MongoClientSettings.FromConnectionString(connectionString);
        settings.AllowInsecureTls = true;
        settings.SslSettings = new SslSettings
        {
            EnabledSslProtocols = SslProtocols.Tls12,
            ServerCertificateValidationCallback = (_, _, _, _) => true
        };
        settings.ServerSelectionTimeout = TimeSpan.FromSeconds(30);
        return new MongoClient(settings);
    }
}
