using Microsoft.AspNetCore.Mvc;
using RrezeBack.Data.DTO;
using static DriverService;

[Route("api/[controller]")]
[ApiController]
public class DriverController : ControllerBase
{
    private readonly IDriverService _driverService;

    public DriverController(IDriverService driverService)
    {
        _driverService = driverService;
    }

    [HttpGet("{driverId}")]
    public async Task<IActionResult> GetDriverProfile(int driverId)
    {
        var driver = await _driverService.GetDriverProfile(driverId);
        if (driver == null)
        {
            return NotFound("Driver not found.");
        }
        return Ok(driver);
    }
    

    [HttpPost("{driverId}/change-two-factor")]
    public async Task<IActionResult> ChangeTwoFactorAuthentication(int driverId, [FromForm] twofadto dto)
    {
        var result = await _driverService.ChangeTwoFactorAuthentication(driverId, dto.TwoFactorEnabled);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/change-profile-picture")]
    public async Task<IActionResult> ChangeProfilePicture(int driverId, [FromForm] IFormFile newProfilePicture)
    {
        var result = await _driverService.ChangeProfilePicture(driverId, newProfilePicture);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/change-driver-license")]
    public async Task<IActionResult> ChangeDriverLicensePhoto(int driverId, [FromForm] IFormFile newDriverLicense)
    {
        var result = await _driverService.ChangeDriverLicensePhoto(driverId, newDriverLicense);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/change-password")]
    public async Task<IActionResult> ChangePassword(int driverId, [FromForm] ChangePasswordDto dto)
    {
        var result = await _driverService.ChangePassword(dto);
        if (result == -1)
        {
            return NotFound("Driver not found.");
        }
        else if (result == -2)
        {
            return BadRequest("Incorrect current password.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/set-status")]
    public async Task<IActionResult> SetStatusToAvailable(int driverId, [FromForm] bool status)
    {
        var result = await _driverService.SetStatusToAvailable(driverId, status);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/accept-ride/{rideId}")]
    public async Task<IActionResult> AcceptRide(int driverId, int rideId, [FromForm] bool accept)
    {
        var result = await _driverService.AcceptRide(driverId, rideId, accept);
        if (!result)
        {
            return NotFound("Driver or Ride not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/cancel-ride/{rideId}")]
    public async Task<IActionResult> CancelRide(int driverId, int rideId)
    {
        var result = await _driverService.CancelRide(driverId, rideId);
        if (result == -1)
            return NotFound("Ride not found");
        else if (result == 0)
            return BadRequest("Cancellation failed");

        return Ok("Ride cancelled successfully");
    }

    [HttpPost("{driverId}/leave-feedback")]
    public async Task<IActionResult> LeaveFeedback(int driverId, [FromForm] FeedbackDTO feedbackDto)
    {
        var result = await _driverService.LeaveFeedback(driverId, feedbackDto);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/paymentmethod")]
    public async Task<IActionResult> AddPaymentMethod(int driverId, [FromForm] PaymentMethodDTO paymentMethodDto)
    {
        var result = await _driverService.AddPaymentMethod(paymentMethodDto);
        if (!result) return BadRequest("Failed to add payment method");

        return Ok("Payment method added successfully");
    }

    [HttpDelete("{driverId}/paymentmethods/{paymentMethodId}")]
    public async Task<IActionResult> DeletePaymentMethod(int driverId, int paymentMethodId)
    {
        var result = await _driverService.DeletePaymentMethod(driverId, paymentMethodId);
        if (!result) return NotFound("Payment method not found");

        return Ok("Payment method deleted successfully.");
    }

    [HttpGet("{driverId}/paymentmethods")]
    public async Task<IActionResult> GetPaymentMethods(int driverId)
    {
        var paymentMethods = await _driverService.GetPaymentMethods(driverId);
        return Ok(paymentMethods);
    }

    [HttpPost("{driverId}/add-new-car")]
    public async Task<IActionResult> AddNewCar(int driverId, [FromForm] VehicleDto vehicleDto)
    {
        var result = await _driverService.AddNewCar(driverId, vehicleDto);
        if (!result) return NotFound("Driver not found.");

        return Ok("Vehicle added successfully.");
    }

    [HttpGet("{driverId}/view-cars")]
    public async Task<IActionResult> ViewCars(int driverId)
    {
        var cars = await _driverService.ViewCars(driverId);
        if (!cars.Any()) return NotFound("No cars found for the driver.");

        return Ok(cars);
    }

    [HttpGet("{driverId}/view-rides")]
    public async Task<IActionResult> ViewRides(int driverId)
    {
        var result = await _driverService.ViewRides(driverId);
        if (result == null || !result.Any())
        {
            return NotFound("No rides found for the driver.");
        }
        return Ok(result);
    }

    [HttpGet("{driverId}/feedbacks")]
    public async Task<IActionResult> GetDriverFeedbacks(int driverId)
    {
        var feedbacks = await _driverService.GetDriverFeedbacks(driverId);
        return Ok(feedbacks);
    }

    [HttpGet("{driverId}/status")]
    public async Task<IActionResult> GetDriverStatus(int driverId)
    {
        try
        {
            var status = await _driverService.GetDriverStatus(driverId);
            return Ok(new { status });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("{driverId}/toggle-status")]
    public async Task<IActionResult> ToggleDriverStatus(int driverId)
    {
        try
        {
            var status = await _driverService.ToggleDriverStatus(driverId);
            return Ok(new { status });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("riderequests")]
    public async Task<IActionResult> GetRideRequests()
    {
        try
        {
            var rideRequests = await _driverService.GetPendingRideRequests();
            return Ok(rideRequests);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("assigndriver")]
    public async Task<IActionResult> AssignDriverToRide([FromBody] AssignDriverDTO assignDriverDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _driverService.AssignDriverToRide(assignDriverDto.RideID, assignDriverDto.DriverID);
            if (!result) return BadRequest("Failed to assign driver to ride");

            return Ok("Driver assigned to ride successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

}
