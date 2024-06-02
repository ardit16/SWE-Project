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

    [HttpPost("{driverId}/add-payment-method")]
    public async Task<IActionResult> AddPaymentMethod(int driverId, [FromForm] PaymentMethodDTO paymentMethodDto)
    {
        var result = await _driverService.AddPaymentMethod(driverId, paymentMethodDto);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpPost("{driverId}/add-new-car")]
    public async Task<IActionResult> AddNewCar(int driverId, VehicleDto vehicleDto )
    {
        var result = await _driverService.AddNewCar(driverId, vehicleDto);
        if (!result)
        {
            return NotFound("Driver not found.");
        }
        return Ok(result);
    }

    [HttpGet("{driverId}/view-cars")]
    public async Task<IActionResult> ViewCars(int driverId)
    {
        var result = await _driverService.ViewCars(driverId);
        if (result == null || !result.Any())
        {
            return NotFound("No cars found for the driver.");
        }
        return Ok(result);
    }

    [HttpGet("{driverId}/view-payment-methods")]
    public async Task<IActionResult> ViewPaymentMethods(int driverId)
    {
        var result = await _driverService.ViewPaymentMethods(driverId);
        if (result == null || !result.Any())
        {
            return NotFound("No payment methods found for the driver.");
        }
        return Ok(result);
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
}
