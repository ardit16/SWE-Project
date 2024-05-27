using RrezeBack.Data.DTO;
using RrezeBack.Data.Model;
using RrezeBack.Data;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using RrezeBack.DTO;
using System;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace RrezeBack.Services
{
    public interface ILogInService
    {
        Task<object> LoginADMIN(LoginDTO dto);
        Task<object> LogInRider(LoginDTO dto);
        Task<object> LogInDriver(LoginDTO dto);
        Task<object> ConfirmFaRider(FaCredencialsDto dto);
        Task<object> ConfirmFaDriver(FaCredencialsDto dto);
        Task<bool> ResendFa(RfaCredencialsDTO dto);
    }
    public class LogInService : ILogInService
    {
        private readonly DBContext _context;
        private readonly IMemoryCache _memoryCache;

        public LogInService(DBContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;
        }

        public string GenerateRandomCode(int length = 6)
        {
            var random = new Random();
            string code = "";
            for (int i = 0; i < length; i++)
                code = string.Concat(code, random.Next(0, 10).ToString());
            return code;
        }

        public async Task<bool> Send2FAEmail(string toEmailAddress, string twoFACode)
        {
            var fromAddress = new MailAddress("Rreze2024@gmail.com", "Rreze");
            var toAddress = new MailAddress(toEmailAddress);
            const string fromPassword = "jipe otwq xklb jvhb";
            const string subject = "Your 2FA Code";
            string body = $"Your two-factor authentication code is: {twoFACode}";

            try
            {
                using (var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                })
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    await smtp.SendMailAsync(message);
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        
        private bool VerifyPassword(string storedHash, string providedPassword)
        {
            // Split the stored hash to get the salt and the hash components
            var parts = storedHash.Split(':', 2);
            if (parts.Length != 2)
            {
                throw new FormatException("The stored password hash is not in the expected format.");
            }

            var salt = Convert.FromBase64String(parts[0]);
            var storedSubkey = parts[1];

            // Hash the provided password using the same salt
            string hashedProvidedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: providedPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            // Compare the hashes
            return storedSubkey == hashedProvidedPassword;
        }
        private string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            return $"{Convert.ToBase64String(salt)}:{hashed}";
        }
        public async Task<object> LoginADMIN(LoginDTO dto)
        {
            var result = await _context.Administrators
                                       .Where(e => e.Email == dto.Email)
                                       .FirstOrDefaultAsync();
            if (result == null || !VerifyPassword(result.Password, dto.Password))
            {
                return false;
            }
            return  new
            {
                Id = result.AdministratorID,
                Name = result.Name,
                Surname = result.Surname,

            };
        }
        public async Task<object> LogInRider(LoginDTO dto)
        {
            try
            {
                var result = await _context.Riders
                                           .Where(e => e.Email == dto.Email)
                                           .FirstOrDefaultAsync();
                if (result == null || !VerifyPassword(result.Password, dto.Password))
                {
                    return null;
                }

                if (result.TwoFactorEnabled)
                {
                    var code = GenerateRandomCode();
                    await Send2FAEmail(result.Email, code);
                    _memoryCache.Set(result.Email, code, TimeSpan.FromMinutes(1));
                    Console.WriteLine("Two-factor authentication is enabled."); // Debugging line
                    return new { Email = result.Email, TwoFactorEnabled = true }; // Ensure property name matches
                }
                else
                {
                    Console.WriteLine("Two-factor authentication is not enabled."); // Debugging line
                    return new
                    {
                        Id = result.RiderID,
                        Name = result.Name,
                        Surname = result.Surname,
                        TwoFactorEnabled = false // Ensure property name matches
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in LogInRider: {ex.Message}"); // Debugging line
                throw;
            }
        }

        public async Task<object> LogInDriver(LoginDTO dto)
        {
            try
            {
                var result = await _context.Drivers
                                           .Where(e => e.Email == dto.Email)
                                           .FirstOrDefaultAsync();
                if (result == null || !VerifyPassword(result.Password, dto.Password))
                {
                    return null;
                }

                if (result.TwoFactorEnabled)
                {
                    var code = GenerateRandomCode();
                    await Send2FAEmail(result.Email, code);
                    _memoryCache.Set(result.Email, code, TimeSpan.FromMinutes(1));
                    return new { Email = result.Email, TwoFactorEnabled = true };
                }
                else
                {
                    return new
                    {
                        Id = result.DriverID,
                        Name = result.Name,
                        Surname = result.Surname,
                        TwoFactorEnabled = false
                    };
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<object> ConfirmFaDriver(FaCredencialsDto dto)
        {
            try
            {
                _memoryCache.TryGetValue(dto.Email, out var code);
                if (code as string != dto.code)
                {
                    return null;
                }

                var user = await _context.Drivers.Where(e => e.Email == dto.Email).FirstOrDefaultAsync();
                if (user == null)
                {
                    return null;
                }

                return new
                {
                    Id = user.DriverID,
                    Name = user.Name,
                    Surname = user.Surname
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<object> ConfirmFaRider(FaCredencialsDto dto)
        {
            try
            {
                _memoryCache.TryGetValue(dto.Email, out var code);
                if (code as string != dto.code)
                {
                    return null;
                }

                var user = await _context.Riders.Where(e => e.Email == dto.Email).FirstOrDefaultAsync();
                if (user == null)
                {
                    return null;
                }

                return new
                {
                    Id = user.RiderID,
                    Name = user.Name,
                    Surname = user.Surname
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> ResendFa(RfaCredencialsDTO dto)
        {
            try
            {
                var code = GenerateRandomCode();
                var result = await Send2FAEmail(dto.Email, code);
                _memoryCache.Set(dto.Email, code, TimeSpan.FromMinutes(1));
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ResendFa: {ex.Message}"); // Debugging line
                return false;
            }
        }
    }
}
