using Microsoft.AspNetCore.Mvc;
using NestQuest.Data.DTO;
using RrezeBack.Data.DTO;
using RrezeBack.Services;
using System.Threading.Tasks;

namespace RrezeBack.Controllers
{
    [Route("api/SingUp")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly ISignUpService _signUpService;

        public SignUpController(ISignUpService signUpService)
        {
            _signUpService = signUpService;
        }

        [HttpPost("AdminSignup")]
        public async Task<IActionResult> SignUpAdmin([FromBody] AdminSignUpDTO adminSignUpDto)
        {
            var result = await _signUpService.SignUpAdminAsync(adminSignUpDto);
            if (!result)
            {
                return BadRequest("Username or email already exists.");
            }
            return Ok("Admin registered successfully.");
        }

        [HttpPost("DriverSignup")]
        public async Task<IActionResult> SignUpDriver([FromForm] SignUpDriverDto driverDto)
        {
            var driver = await _signUpService.SignUpDriver(driverDto);
            if (driver == null)
            {
                return BadRequest("Email already exists.");
            }
            return Ok("Driver registered successfully.");
        }

        [HttpPost("RiderSignup")]
        public async Task<IActionResult> SignUpRider([FromBody] SignUpRiderDto riderDto)
        {
            var rider = await _signUpService.SignUpRider(riderDto);
            if (rider == null)
            {
                return BadRequest("Email already exists.");
            }
            return Ok("Rider registered successfully.");
        }

        [HttpPost("google-signup-rider")]
        public async Task<IActionResult> GoogleSignUp([FromBody] GoogleSignUpDTO dto)
        {
            var result = await _signUpService.GoogleSignUpRider(dto.IdToken);
            if (result == null)
            {
                return BadRequest("User already exists or invalid role.");
            }
            return Ok(result);
        }
    }

}
