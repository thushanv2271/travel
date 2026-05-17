using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TaproTravels.Api.Services;
using TaproTravels.Api.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<GoogleSettings>(builder.Configuration.GetSection("GoogleSettings"));

builder.Services.AddSingleton<PackageService>();
builder.Services.AddSingleton<DestinationService>();
builder.Services.AddSingleton<BookingService>();
builder.Services.AddSingleton<InquiryService>();
builder.Services.AddSingleton<AdminUserService>();
builder.Services.AddSingleton<UserService>();

var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["SecretKey"] ?? throw new InvalidOperationException("JwtSettings:SecretKey is required");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaproTravels API",
        Version = "v1",
        Description = "REST API for TaproTravels travel booking platform"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token here"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var corsOrigins = (builder.Configuration["CorsOrigins"]
    ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:4173,http://127.0.0.1:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(corsOrigins)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var adminService = scope.ServiceProvider.GetRequiredService<AdminUserService>();
    await adminService.SeedDefaultAdminAsync();
}

app.UseCors("FrontendPolicy");

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaproTravels API v1");
    options.RoutePrefix = "swagger";
});

if (app.Environment.IsDevelopment())
{
    var appUrl = app.Configuration["urls"]?.Split(';')[0]
        ?? app.Configuration["Urls"]?.Split(';')[0]
        ?? app.Configuration["ASPNETCORE_URLS"]?.Split(';')[0];

    if (appUrl is not null)
    {
        _ = Task.Run(async () =>
        {
            await Task.Delay(2000);
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo($"{appUrl}/swagger") { UseShellExecute = true });
        });
    }
}

app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await app.RunAsync();
