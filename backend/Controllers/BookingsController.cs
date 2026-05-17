using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaproTravels.Api.Models;
using TaproTravels.Api.Services;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController(BookingService service) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(string id)
    {
        var booking = await service.GetByIdAsync(id);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Booking booking)
    {
        await service.CreateAsync(booking);
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] StatusUpdateRequest req)
    {
        if (await service.GetByIdAsync(id) is null) return NotFound();
        await service.UpdateStatusAsync(id, req.Status);
        return Ok(new { id, status = req.Status });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        if (await service.GetByIdAsync(id) is null) return NotFound();
        await service.DeleteAsync(id);
        return NoContent();
    }
}

public record StatusUpdateRequest(string Status);
