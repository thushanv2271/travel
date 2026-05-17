using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaproTravels.Api.Models;
using TaproTravels.Api.Services;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/destinations")]
public class DestinationsController(DestinationService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var dest = await service.GetByIdAsync(id);
        return dest is null ? NotFound() : Ok(dest);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Destination dest)
    {
        await service.CreateAsync(dest);
        return CreatedAtAction(nameof(GetById), new { id = dest.Id }, dest);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(string id, [FromBody] Destination dest)
    {
        if (await service.GetByIdAsync(id) is null) return NotFound();
        dest.Id = id;
        await service.UpdateAsync(id, dest);
        return Ok(dest);
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
