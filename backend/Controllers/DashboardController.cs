using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaproTravels.Api.Services;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(
    PackageService packages,
    DestinationService destinations,
    BookingService bookings,
    InquiryService inquiries) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> Stats() => Ok(new
    {
        totalPackages     = await packages.CountAsync(),
        totalDestinations = await destinations.CountAsync(),
        totalBookings     = await bookings.CountAsync(),
        pendingBookings   = await bookings.CountByStatusAsync("pending"),
        unreadInquiries   = await inquiries.CountUnreadAsync()
    });
}
