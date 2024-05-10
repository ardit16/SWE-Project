using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NestQuest.Data.DTO;
using RrezeBack.Data.DTO;
using RrezeBack.Services;
using System;
using System.Threading.Tasks;

namespace RrezeBack.Controllers
{
    [Route("api/Signup")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly ISignUpService _signUpService;

        public SignUpController(ISignUpService signUpService)
        {
            _signUpService = signUpService;
        }

        [HttpPost("SignUpRider")]
        public async Task<ActionResult> SignUpRider([FromForm] SignUpRiderDto riderDto)
        {
            try
            {
                var user = await _signUpService.SignUpRider(riderDto);
                if (user == null) { return Conflict(); }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPost("SignUpDriver")]
        public async Task<ActionResult> SignUpDriver([FromForm] SignUpDriverDto driverDto)
        {
            try
            {
                var user = await _signUpService.SignUpDriver(driverDto);
                if (user == null) { return Conflict(); }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
