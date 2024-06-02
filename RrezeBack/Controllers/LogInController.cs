using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RrezeBack.DTO;
using RrezeBack.Data.DTO;
using RrezeBack.Services;
using System;
using System.Threading.Tasks;

namespace RrezeBack.Controllers
{
    
    [Route("api/LogIn")]
    [ApiController]
    public class LogInController : ControllerBase
    {
        private readonly ILogInService _logInService;

        
        public LogInController(ILogInService logInService)
        {
            _logInService = logInService;
        }
        [HttpPost("LogInAdmin")]
        public async Task<IActionResult> LoginAdmin([FromForm] LoginDTO loginDto)
        {
            var result = await _logInService.LoginADMIN(loginDto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost("LogInRider")]
        public async Task<ActionResult> LogInRider([FromForm] LoginDTO dto)
        {
            try
            {
                var result = await _logInService.LogInRider(dto);
                if (result == null) { return NotFound(); }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("LogInDriver")]
        public async Task<ActionResult> LogInDriver([FromForm] LoginDTO dto)
        {
            try
            {
                var result = await _logInService.LogInDriver(dto);
                if (result == null) { return NotFound(); }
                if (result is IDictionary<string, object> dict && dict.ContainsKey("Error"))
                {
                    return BadRequest(dict["Error"]);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Check_2FA_Rider")]
        public async Task<ActionResult> Check2FaRider([FromForm] FaCredencialsDto dto)
        {
            try
            {
                var result = await _logInService.ConfirmFaRider(dto);
                if (result == null) { return NotFound(); }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("Check_2FA_Driver")]
        public async Task<ActionResult> Check2FaDriver([FromForm] FaCredencialsDto dto)
        {
            try
            {
                var result = await _logInService.ConfirmFaDriver(dto);
                if (result == null) { return NotFound(); }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("Resend_2FA")]
        public async Task<ActionResult> Resend2Fa([FromForm] RfaCredencialsDTO dto)
        {
            try
            {
                var result = await _logInService.ResendFa(dto);
                if (result)
                {
                    return Ok(result);
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Resend2Fa: {ex.Message}"); // Debugging line
                return BadRequest();
            }
     
        }

        [HttpPost("google-login-rider")]
        public async Task<IActionResult> GoogleLogin([FromForm] string idToken)
        {
            var result = await _logInService.GoogleLogin(idToken);
            if (result == null)
            {
                return Unauthorized("Invalid Google token.");
            }
            return Ok(result);
        }
    }
}
