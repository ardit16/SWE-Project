using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using RrezeBack.Data.DTO;
using RrezeBack.Services;

namespace RrezeBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RiderController : ControllerBase
    {
        private readonly IRiderService _riderService;

        public RiderController(IRiderService riderService)
        {
            _riderService = riderService;
        }

        [HttpGet("{riderId}")]
        public async Task<IActionResult> GetRiderProfile(int riderId)
        {
            var rider = await _riderService.GetRiderProfile(riderId);
            if (rider == null) return NotFound();
            return Ok(rider);
        }

        [HttpPut("{riderId}/updateinfo")]
        public async Task<IActionResult> UpdateRiderProfile(int riderId, [FromBody] RiderDTO riderDto)
        {
            if (riderId != riderDto.RiderID) return BadRequest("Rider ID mismatch");

            var result = await _riderService.UpdateRiderProfile(riderId,riderDto);
            if (!result) return NotFound();

            return NoContent(); // Consider using Ok() if you want to return a confirmation message.
        }

        [HttpPost("{riderId}/changepassword")]
        public async Task<IActionResult> ChangePassword(int riderId, [FromBody] ChangePasswordDto changePasswordDto)
        {
            if (riderId != changePasswordDto.Id)
                return BadRequest("Rider ID mismatch");

            var result = await _riderService.ChangePassword(changePasswordDto);
            switch (result)
            {
                case -1:
                    return NotFound("Rider not found.");
                case -2:
                    return BadRequest("Invalid current password.");
                case 0:
                    return BadRequest("Password change failed.");
                default:
                    return Ok("Password changed successfully.");
            }
            if (riderId != changePasswordDto.Id) return BadRequest("Rider ID mismatch");
            if (result <= 0) return BadRequest("Password change failed");

            return NoContent(); // Consider using Ok() if you want to return a confirmation message.
        }

        [HttpPost("requestride")]
        public async Task<IActionResult> RequestRide([FromBody] RideDTO rideRequestDto)
        {
            var result = await _riderService.RequestRide(rideRequestDto);
            if (!result) return BadRequest("Ride request failed");

            return Ok("Ride requested successfully");
        }

        [HttpPost("cancelride/{riderid}")]
        public async Task<IActionResult> CancelRide( string riderid)
        {

            int result = await _riderService.CancelRide(int.Parse(riderid));
            if (result == -1)
                return NotFound("Ride not found");
            else if (result == 0)
                return BadRequest("Cancellation failed");

            return Ok("Ride cancelled successfully");
        }
        
        [HttpPost("feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackDTO feedbackDto)
        {
            var result = await _riderService.SubmitFeedback(feedbackDto);
            if (!result) return BadRequest("Feedback submission failed");

            return Ok("Feedback submitted successfully");
        }

        [HttpPost("{riderId}/paymentmethod")]
        public async Task<IActionResult> AddPaymentMethod(int riderId, [FromBody] PaymentMethodDTO paymentMethodDto)
        {
            var result = await _riderService.AddPaymentMethod(riderId, paymentMethodDto);
            if (!result) return BadRequest("Failed to add payment method");

            return Ok("Payment method added successfully");
        }

        [HttpGet("{riderId}/rating")]
        public async Task<IActionResult> CheckRating(int riderId)
        {
            var rating = await _riderService.CheckRating(riderId);
            return Ok(rating);
        }

        [HttpGet("{riderId}/rides")]
        public async Task<IActionResult> GetPreviousRides(int riderId)
        {
            var rides = await _riderService.GetPreviousRidesAsync(riderId);
            return Ok(rides);
        }
    }
}
