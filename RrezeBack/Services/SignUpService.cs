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
using Google.Apis.Auth;

namespace RrezeBack.Services
{
    public interface ISignUpService
    {
        Task<Driver> SignUpDriver(SignUpDriverDto driverDto);
        Task<Rider> SignUpRider(SignUpRiderDto riderDto);
        Task<bool> SignUpAdminAsync(AdminSignUpDTO adminSignUpDto);
        Task<object> GoogleSignUpRider(string idToken);
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
                var existingEmailUser = await _context.Drivers.Where(e => e.Email == driverDto.Email).FirstOrDefaultAsync();
                var existingPhoneUser = await _context.Drivers.Where(e => e.PhoneNumber == driverDto.Phone).FirstOrDefaultAsync();

                if (existingEmailUser != null)
                {
                    throw new Exception("Email already exists.");
                }

                if (existingPhoneUser != null)
                {
                    throw new Exception("Phone number already exists.");
                }

                var newUser = new Driver
                {
                    Name = driverDto.Name,
                    Surname = driverDto.Surname,
                    Email = driverDto.Email,
                    Password = HashPassword(driverDto.Password),
                    PhoneNumber = driverDto.Phone,
                    TwoFactorEnabled = driverDto.Two_Fa,
                    Birthday = driverDto.Birthday,
                    status = false,
                    Verified = false,
                    ovrating = 0,
                    DateAdded = DateTime.Now,
                };

                await _context.Drivers.AddAsync(newUser);
                await _context.SaveChangesAsync();

                string profilePhotoFileName = $"{newUser.DriverID}_profile.jpg";
                string profilePhotosDirectoryPath = @"C:Users/Megi Dervishi/OneDrive/Desktop/driverslicense";

                if (!Directory.Exists(profilePhotosDirectoryPath))
                {
                    Directory.CreateDirectory(profilePhotosDirectoryPath);
                }

                string profilePhotoFilePath = Path.Combine(profilePhotosDirectoryPath, profilePhotoFileName);
                using (var stream = new FileStream(profilePhotoFilePath, FileMode.Create))
                {
                    await driverDto.photo.CopyToAsync(stream);
                }

                string licensePhotoFileName = $"{newUser.DriverID}_license.jpg";
                string licensePhotosDirectoryPath = @"C:Users/Megi Dervishi/OneDrive/Desktop/driverslicense";   

                if (!Directory.Exists(licensePhotosDirectoryPath))
                {
                    Directory.CreateDirectory(licensePhotosDirectoryPath);
                }

                string licensePhotoFilePath = Path.Combine(licensePhotosDirectoryPath, licensePhotoFileName);
                using (var stream = new FileStream(licensePhotoFilePath, FileMode.Create))
                {
                    await driverDto.DriverLicense.CopyToAsync(stream);
                }

                Console.WriteLine("Driver registered successfully.");
                return newUser;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Rider> SignUpRider(SignUpRiderDto riderDto)
        {
            try
            {
                var existingEmailUser = await _context.Riders.Where(e => e.Email == riderDto.Email).FirstOrDefaultAsync();
                var existingPhoneUser = await _context.Riders.Where(e => e.PhoneNumber == riderDto.Phone).FirstOrDefaultAsync();

                if (existingEmailUser != null)
                {
                    throw new Exception("Email already exists.");
                }

                if (existingPhoneUser != null)
                {
                    throw new Exception("Phone number already exists.");
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
                    ovrating=0,
                    DateAdded= DateTime.Now,

                };

                await _context.Riders.AddAsync(newUser);
                await _context.SaveChangesAsync();

                Console.WriteLine("Rider registered successfully.");
                return newUser;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> SignUpAdminAsync(AdminSignUpDTO adminSignUpDto)
        {
            var existingAdmin = await _context.Administrators
                .FirstOrDefaultAsync(a =>  a.Email == adminSignUpDto.Email);
            if (existingAdmin != null)
            {
                return false; // Email already exists
            }

            var admin = new Administrator
            {
                
                Email = adminSignUpDto.Email,
                Password = HashPassword(adminSignUpDto.Password), 
                Name = adminSignUpDto.Name,
                Surname=adminSignUpDto.Surname,
                PhoneNumber=adminSignUpDto.Phone,
                Birthday=adminSignUpDto.Birthday,
                
            };

            _context.Administrators.Add(admin);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GoogleSignUpRider(string idToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
            var existingUser = await _context.Riders.FirstOrDefaultAsync(u => u.Email == payload.Email);

            try
            {
                if (existingUser != null){

                return null; // User already exists
                }

                var newUser = new Rider
                {
                    Name = payload.GivenName,
                    Surname = payload.FamilyName,
                    Email = payload.Email,
                    TwoFactorEnabled = false,
                    DateAdded = DateTime.Now,
                };

                await _context.Riders.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return newUser;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
