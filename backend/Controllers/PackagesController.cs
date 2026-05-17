using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaproTravels.Api.Models;
using TaproTravels.Api.Services;

namespace TaproTravels.Api.Controllers;

[ApiController]
[Route("api/packages")]
public class PackagesController(PackageService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var pkg = await service.GetByIdAsync(id);
        return pkg is null ? NotFound() : Ok(pkg);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Package pkg)
    {
        await service.CreateAsync(pkg);
        return CreatedAtAction(nameof(GetById), new { id = pkg.Id }, pkg);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(string id, [FromBody] Package pkg)
    {
        if (await service.GetByIdAsync(id) is null) return NotFound();
        pkg.Id = id;
        await service.UpdateAsync(id, pkg);
        return Ok(pkg);
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
