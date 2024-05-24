using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RrezeBack.Data.DTO;
using RrezeBack.Services;

namespace RrezeBack.Controllers
{
    [ApiController]
    [Route("api/driver")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService_driverService;
            public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet("{driverId}")]
        public async Task<IActionResult> GetDriverProfile(int driverId)
        {
            var driver = await _driverService.GetDriverProfile(driverId);
            if (driver == null) returnNotFound();
            return Ok(driver);
        }

        [HttpPut("{driverId}/updateinfo")]
        public async Task<IActionResult> UpdateDriverProfile(int driverId, [FromBody] DriverDTO driverDto)
        {
            if (driverID != driverDto.DriverID)
                return BadRequest("Driver ID mismatch");
            var result = await _driverService.UpdateDriverProfile(driverId, driverDto);
            if (!result)
                return NotFound();
            return NoContent();

        }

        [HttpPost("{driverId}/changepassword")]
        public async Task<IActionResult> ChangePassword(int driverId, [FromBody] ChangePasswordDto changePasswordDto)
        {
            if (driverId != changePasswordDto.Id)
                return BadRequest("Driver ID mismatch");
            var result = await _driverService.ChangePassword(changePasswordDto);
            switch(result)
            {
                case -1;
                    return NotFound("Driver not found.");
                    case -2;
                    return BadRequest("Ivalid current password.");
                        case 0;
                    return BadRequest("Password change failed.");
                        default;
                    return Ok("Password changed successfully.");
            }
        }

        [HttpPost("acceptrequest/{requestId}")]
        public async Task<IActionResult> AcceptRideRequest(int requestId)
        {
            var result = await_ driverService.AcceptRideRequest(requestId);
            if (!result) 
                return BadRequest("Ride request acceptance failed.");
            return Ok("Ride request accepted successfully");
        }

        [HttpPost("completeride/{rideId}")]
        public async Task<IActionResult> CompleteRide(int rideId)
        {
            var result = await _driverService.CompleteRideRequest(rideId);
            if (result == -1)
                return NotFound("Ride not found");
            else if (result == 0)
                return BadRequest("Completion failed");
            return Ok("Ride completed successfully");
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> TakeFeedback([FromBody] FeedBackDTO feedbackDto)
        {
            var result = await _driverService.SubmitFeedback(feedbackDto);
            if (!result)
                return BadRequest("Feedback  failed");
            return Ok("Feedback taked Sucessfully");

        }

        [HttpGet("{driverId}/rating")]
        public async Task<IActionResult> CheckRating(int driverId)
        {
            var rating = await _driverService.CheckRating(driverId);
            return Ok(rating);
        }

        [HttpGet("{driverId}/rides")]
        public async Task<IActionResult> GetPreviousRides(int driverId)
        {
            var rides = await _driverService.GetPreviousRidesAsync(driverId);
            return Ok(rides);


        }
}
