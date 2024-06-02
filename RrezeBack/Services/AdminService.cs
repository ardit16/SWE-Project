using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using RrezeBack.Data.DTO;
using RrezeBack.DTO;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace RrezeBack.Services
{
    public interface IAdminService
    {
        Task<AdminDto> GetAdminProfile(int AdminId);
        Task<bool> AcceptNewDriverAsync(int DriverId);
        Task<bool> DeleteRiderAsync(int userId);
        Task<bool> DeleteDriverAsync(int userId);
        Task<IEnumerable<RideDTO>> GetRidesAsync();
        Task<IEnumerable<FeedbackDTO>> GetRatingsAsync();
        Task<int> ChangePassword(ChangePasswordDto changePasswordDto);
        Task<List<DriverDTO>> GetAllDriversAsync();
        Task<bool> VerifyVehicleAsync(int vehicleId);
    }

    public class AdminService : IAdminService
    {
        private readonly DBContext _context;

        public AdminService(DBContext context)
        {
            _context = context;
        }
        public async Task<AdminDto> GetAdminProfile(int AdminId)
        {
            var admin = await _context.Administrators.FindAsync(AdminId);
            if (admin == null) return null;

            return new AdminDto
            {
                Id=admin.AdministratorID,
                Name=admin.Name,
                Surname=admin.Surname,
                Birthday=admin.Birthday,
                Email=admin.Email,
                PhoneNumber=admin.PhoneNumber,

            };
        }

        public async Task<List<DriverDTO>> GetAllDriversAsync()
        {
            var drivers = await _context.Drivers.ToListAsync();
            return drivers.Select(driver => new DriverDTO
            {
                DriverID=driver.DriverID,
                Name = driver.Name,
                Surname = driver.Surname,
                Birthday = driver.Birthday,
                Email = driver.Email,
                PhoneNumber = driver.PhoneNumber,
                Verified = driver.Verified,
                DateAdded=driver.DateAdded,
                ProfilePicturePath=driver.ProfilePicturePath,
                DriverLicensepath=driver.DriverLicensepath, 
                status=driver.status,
                ovrating=driver.ovrating,
                TwoFactorEnabled=driver.TwoFactorEnabled,

            }).ToList();
        }


        public async Task<bool> AcceptNewDriverAsync(int DriverId)
        {
            var driver = await _context.Drivers.FindAsync(DriverId);
            if (driver == null)
            {
                return false;
            }

            driver.Verified = true;
            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> VerifyVehicleAsync(int vehicleId)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
            {
                return false;
            }

            if (vehicle.VehicleStatus != "Verified")
            {
                vehicle.VehicleStatus = "Verified";
                _context.Vehicles.Update(vehicle);
                await _context.SaveChangesAsync();
            }

            return true;
        }



        public async Task<bool> DeleteRiderAsync(int userId)
        {
            var user = await _context.Riders.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            _context.Riders.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDriverAsync(int userId)
        {
            var user = await _context.Drivers.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            _context.Drivers.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RideDTO>> GetRidesAsync()
        {
            var rides = await _context.Rides.ToListAsync();
            return rides.Select(ride => new RideDTO
            {
                RideID = ride.RideID,
                PickUpName = ride.PickUpName,
                DropOffName = ride.DropOffName,
                RideStartTime = ride.RideStartTime,
                RideEndTime = ride.RideEndTime,
                RideDistance = ride.RideDistance,
                Amount = ride.Amount,
                DriverId = ride.DriverID,
                RiderID = ride.RiderID,
            }).ToList();
        }

        public async Task<IEnumerable<FeedbackDTO>> GetRatingsAsync()
        {
            var feedbacks = await _context.Feedbacks.ToListAsync();
            return feedbacks.Select(feedback => new FeedbackDTO
            {
                RideID = feedback.RideID,
                DriverID = feedback.DriverID,
                DriverComment = feedback.DriverComment,
                DriverRating = feedback.DriverRating,
                RiderID = feedback.RiderID,
                RiderRating = feedback.RiderRating,
                RiderComment = feedback.RiderComment,
            }).ToList();
        }

        private bool VerifyPassword(string storedHash, string providedPassword)
        {
            var parts = storedHash.Split(':', 2);
            if (parts.Length != 2)
            {
                throw new FormatException("The stored password hash is not in the expected format.");
            }

            var salt = Convert.FromBase64String(parts[0]);
            var storedSubkey = parts[1];

            string hashedProvidedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: providedPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

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

        public async Task<int> ChangePassword(ChangePasswordDto dto)
        {
            try
            {
                var rezult = await _context.Administrators
                    .Where(u => u.AdministratorID == dto.Id)
                    .FirstOrDefaultAsync();
                if (rezult == null) { return -1; }
                if (VerifyPassword(rezult.Password, dto.Password))
                {
                    rezult.Password = HashPassword(dto.NewPassword);

                    var nr = _context.SaveChanges();
                    return nr;
                }
                else
                {
                    return -2;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
