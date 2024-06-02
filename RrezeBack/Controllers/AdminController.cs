using Microsoft.AspNetCore.Mvc;
using RrezeBack.Data.DTO;
using RrezeBack.DTO;
using RrezeBack.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RrezeBack.Controllers
{
    [Route("api/Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("{AdminID}")]
        public async Task<IActionResult> GetADIMNProfile(int AdminID)
        {
            var admin = await _adminService.GetAdminProfile(AdminID);
            if (admin == null) return NotFound();
            return Ok(admin);
        }

        [HttpPost("verify/{vehicleId}")]
        public async Task<IActionResult> VerifyVehicle(int vehicleId)
        {
            var result = await _adminService.VerifyVehicleAsync(vehicleId);
            if (result)
            {
                return Ok(new { message = "Vehicle verified successfully." });
            }
            else
            {
                return NotFound(new { message = "Vehicle not found." });
            }
        }
        [HttpPost("Accept-Driver/{driverId}")]
        public async Task<IActionResult> AcceptNewDriver(int driverId)
        {
            var result = await _adminService.AcceptNewDriverAsync(driverId);
            if (!result)
            {
                return NotFound("Driver not found.");
            }
            return Ok("Driver accepted successfully.");
        }
        [HttpGet("Get-All-Drivers")]
        public async Task<IActionResult> GetAllDrivers()
        {
            var drivers = await _adminService.GetAllDriversAsync();
            return Ok(drivers);
        }


        [HttpDelete("Delete-Rider/{riderId}")]
        public async Task<IActionResult> DeleteRider(int riderId)
        {
            var result = await _adminService.DeleteRiderAsync(riderId);
            if (!result)
            {
                return NotFound("Rider not found.");
            }
            return Ok("Rider deleted successfully.");
        }

        [HttpDelete("Delete-Driver/{driverId}")]
        public async Task<IActionResult> DeleteDriver(int driverId)
        {
            var result = await _adminService.DeleteDriverAsync(driverId);
            if (!result)
            {
                return NotFound("Driver not found.");
            }
            return Ok("Driver deleted successfully.");
        }

        [HttpGet("Rides")]
        public async Task<IActionResult> GetRides()
        {
            var rides = await _adminService.GetRidesAsync();
            return Ok(rides);
        }

        [HttpGet("Ratings")]
        public async Task<IActionResult> GetRatings()
        {
            var ratings = await _adminService.GetRatingsAsync();
            return Ok(ratings);
        }

        [HttpPost("Change-Password")]
        public async Task<IActionResult> ChangePassword([FromForm] ChangePasswordDto changePasswordDto)
        {
            var result = await _adminService.ChangePassword(changePasswordDto);
            if (result == -1)
            {
                return NotFound("Administrator not found.");
            }
            else if (result == -2)
            {
                return BadRequest("Current password is incorrect.");
            }
            return Ok("Password changed successfully.");
        }
        [HttpGet("Get-All-Vehicles")]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _adminService.GetAllVehiclesAsync();
            return Ok(vehicles);
        }

        [HttpDelete("Delete-Vehicle/{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            var result = await _adminService.DeleteVehicleAsync(vehicleId);
            if (result)
            {
                return Ok(new { message = "Vehicle deleted successfully." });
            }
            else
            {
                return NotFound(new { message = "Vehicle not found." });
            }
        }

    }
}
