using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using NestQuest.Data.DTO;
using RrezeBack.Data;
using RrezeBack.Data.DTO;
using RrezeBack.Data.Model;
using RrezeBack.DTO;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace RrezeBack.Services
{
    public interface ISignUpService
    {
        Task<Driver> SignUpDriver(SignUpDriverDto driverDto);
        Task<Rider> SignUpRider(SignUpRiderDto riderDto);
            
        
    }

    public class SignUpService : ISignUpService
    {
        private readonly DBContext _context;

        public SignUpService(DBContext context)
        {
            _context = context;
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

        public async Task<Driver> SignUpDriver(SignUpDriverDto driverDto)
        {
            try
            {
                var existingUser = await _context.Drivers.Where(e => e.Email == driverDto.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return null;
                }

                var newUser = new Driver
                {
                    Name = driverDto.Name,
                    Surname = driverDto.Surname,
                    Email = driverDto.Email,
                    Password = HashPassword(driverDto.Password),
                    PhoneNumber = driverDto.Phone,
                    TwoFactorEnabled = driverDto.Two_Fa,
                    
                };

                await _context.Drivers.AddAsync(newUser);
                await _context.SaveChangesAsync();

                string fileName = $"{newUser.DriverID}.jpg";
                string photosDirectoryPath = @"C:\Users\ardit\Desktop";

                if (!Directory.Exists(photosDirectoryPath))
                {
                    Directory.CreateDirectory(photosDirectoryPath);
                }

                string filePath = Path.Combine(photosDirectoryPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await driverDto.photo.CopyToAsync(stream);
                }

                return newUser;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Rider> SignUpRider(SignUpRiderDto riderDto)
        {
            try
            {
                var existingUser = await _context.Riders.Where(e => e.Email == riderDto.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return null;
                }

                var newUser = new Rider
                {
                    Name = riderDto.Name,
                    Surname = riderDto.Surname,
                    Email = riderDto.Email,
                    Password = HashPassword(riderDto.Password),
                    PhoneNumber = riderDto.Phone,
                    Birthday = riderDto.Birthday,
                    TwoFactorEnabled = riderDto.Two_Fa,
                    
                };

                await _context.Riders.AddAsync(newUser);
                await _context.SaveChangesAsync();

                string fileName = $"{newUser.RiderID}.jpg";
                string photosDirectoryPath = @"C:\Users\ardit\Desktop";

                if (!Directory.Exists(photosDirectoryPath))
                {
                    Directory.CreateDirectory(photosDirectoryPath);
                }

                string filePath = Path.Combine(photosDirectoryPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await riderDto.photo.CopyToAsync(stream);
                }

                return newUser;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        Task<Driver> ISignUpService.SignUpDriver(SignUpDriverDto driverDto)
        {
            throw new NotImplementedException();
        }

        Task<Rider> ISignUpService.SignUpRider(SignUpRiderDto riderDto)
        {
            throw new NotImplementedException();
        }
    }
}
