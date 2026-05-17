using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaproTravels.Api.Models;
using TaproTravels.Api.Services;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/inquiries")]
public class InquiriesController(InquiryService service) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(string id)
    {
        var inquiry = await service.GetByIdAsync(id);
        return inquiry is null ? NotFound() : Ok(inquiry);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Inquiry inquiry)
    {
        await service.CreateAsync(inquiry);
        return CreatedAtAction(nameof(GetById), new { id = inquiry.Id }, inquiry);
    }

    [HttpPatch("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkRead(string id)
    {
        if (await service.GetByIdAsync(id) is null) return NotFound();
        await service.MarkReadAsync(id);
        return Ok(new { id, isRead = true });
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
