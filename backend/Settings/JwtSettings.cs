namespace TaproTravels.Api.Settings;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = "TaproTravels";
    public string Audience { get; set; } = "TaproTravelsAdmin";
    public int ExpiryHours { get; set; } = 8;
}
