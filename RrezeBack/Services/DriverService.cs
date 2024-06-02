using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using RrezeBack.Data.DTO;
using RrezeBack.Data.Model;
using System.Security.Cryptography;

public class DriverService
{
    public interface IDriverService
    {
        Task<DriverDTO> GetDriverProfile(int driverId);
        Task<bool> ChangeTwoFactorAuthentication(int driverId, bool enable2FA);
        Task<bool> ChangeProfilePicture(int driverId, IFormFile newProfilePicture);
        Task<bool> ChangeDriverLicensePhoto(int driverId, IFormFile newDriverLicense);
        Task<int> ChangePassword(ChangePasswordDto dto);
        Task<bool> SetStatusToAvailable(int driverId, bool status);
        Task<bool> AcceptRide(int driverId, int rideId, bool accept);
        Task<int> CancelRide(int driverId, int rideId);
        Task<bool> LeaveFeedback(int driverId, FeedbackDTO feedbackDto);
        Task<bool> AddPaymentMethod(PaymentMethodDTO paymentMethodDto);
        Task<bool> DeletePaymentMethod(int driverId, int paymentMethodId);
        Task<IEnumerable<PaymentMethodDTO>> GetPaymentMethods(int driverId);
        Task<bool> AddNewCar(int driverId, VehicleDto vehicleDto);
        Task<List<Vehicle>> ViewCars(int driverId);
        Task<List<Ride>> ViewRides(int driverId);
        Task<IEnumerable<FeedbackDTO>> GetDriverFeedbacks(int driverId);
    }

    public class DriverServices: IDriverService
    {
        private readonly DBContext _context;

        public DriverServices(DBContext context)
        {
            _context = context;
        }

        public async Task<DriverDTO> GetDriverProfile(int driverId)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null) return null;

            return new DriverDTO
            {
                DriverID = driver.DriverID,
                Name = driver.Name,
                Surname = driver.Surname,
                Email = driver.Email,
                Birthday = driver.Birthday,
                PhoneNumber = driver.PhoneNumber,
                TwoFactorEnabled = driver.TwoFactorEnabled,
                status = driver.status,
                Verified = driver.Verified,
                ovrating = driver.ovrating,
                DateAdded = driver.DateAdded
            };
        }

        public async Task<bool> ChangeTwoFactorAuthentication(int driverId, bool enable2FA)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                return false;
            }
            driver.TwoFactorEnabled = enable2FA;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangeProfilePicture(int driverId, IFormFile newProfilePicture)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                return false;
            }

            string profilePhotoFileName = $"{driver.DriverID}_profile.jpg";
            string profilePhotosDirectoryPath = @"C:/Users/ardit/Desktop/profile";
            string profilePhotoFilePath = Path.Combine(profilePhotosDirectoryPath, profilePhotoFileName);

            if (!Directory.Exists(profilePhotosDirectoryPath))
            {
                Directory.CreateDirectory(profilePhotosDirectoryPath);
            }
            if (File.Exists(profilePhotoFilePath))
            {
                File.Delete(profilePhotoFilePath);
            }

            using (var stream = new FileStream(profilePhotoFilePath, FileMode.Create))
            {
                await newProfilePicture.CopyToAsync(stream);
            }

            return true;
        }

        public async Task<bool> ChangeDriverLicensePhoto(int driverId, IFormFile newDriverLicense)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                return false;
            }

            string licensePhotoFileName = $"{driver.DriverID}_license.jpg";
            string licensePhotosDirectoryPath = @"C:/Users/ardit/Desktop/driverslicense";
            string licensePhotoFilePath = Path.Combine(licensePhotosDirectoryPath, licensePhotoFileName);

            if (!Directory.Exists(licensePhotosDirectoryPath))
            {
                Directory.CreateDirectory(licensePhotosDirectoryPath);
            }

            if (File.Exists(licensePhotoFilePath))
            {
                File.Delete(licensePhotoFilePath);
            }

            using (var stream = new FileStream(licensePhotoFilePath, FileMode.Create))
            {
                await newDriverLicense.CopyToAsync(stream);
            }

            return true;
        }

        public async Task<int> ChangePassword(ChangePasswordDto dto)
        {
            try
            {
                var rezult = await _context.Drivers
                        .Where(u => u.DriverID == dto.Id)
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

        public async Task<bool> SetStatusToAvailable(int driverId, bool status)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                return false;
            }
            driver.status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AcceptRide(int driverId, int rideId, bool accept)
        {
            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null || ride.DriverID != driverId)
            {
                return false;
            }
            ride.RideStatus = accept;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> CancelRide(int driverId, int rideId)
        {
            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null) return -1;

            _context.Rides.Remove(ride);
            await _context.SaveChangesAsync();

            return 1;
        }

        public async Task<bool> LeaveFeedback(int driverId, FeedbackDTO feedbackDto)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                return false;
            }

            var feedback = new Feedbacks
            {
                RideID = feedbackDto.RideID,
                DriverID = feedbackDto.DriverID,
                RiderID = feedbackDto.RiderID,
                DriverRating = feedbackDto.DriverRating,
                DriverComment = feedbackDto.DriverComment,
            };

            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddPaymentMethod(PaymentMethodDTO paymentMethodDto)
        {
            var driver = await _context.Drivers.FindAsync(paymentMethodDto.DriverID);

            if (driver == null)
            {
                throw new Exception($"Driver with ID {paymentMethodDto.DriverID} not found");
            }

            var existingPaymentMethod = await _context.PaymentMethod
                .FirstOrDefaultAsync(pm => pm.DriverID == paymentMethodDto.DriverID && pm.PaymentType == "CreditCard");

            if (existingPaymentMethod != null)
            {
                throw new Exception("Driver already has a credit card payment method");
            }

            var paymentMethod = new PaymentMethod
            {
                DriverID = paymentMethodDto.DriverID,
                PaymentType = paymentMethodDto.PaymentType,
                CardNumber = paymentMethodDto.CardNumber,
                ExpiryDate = paymentMethodDto.ExpiryDate,
                CVV = paymentMethodDto.CVV,
                CardName = paymentMethodDto.CardName,
            };

            try
            {
                _context.PaymentMethod.Add(paymentMethod);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"An error occurred while saving the payment method: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public async Task<bool> DeletePaymentMethod(int driverId, int paymentMethodId)
        {
            var paymentMethod = await _context.PaymentMethod
                .FirstOrDefaultAsync(pm => pm.DriverID == driverId && pm.PaymentId == paymentMethodId);

            if (paymentMethod == null)
            {
                return false;
            }

            _context.PaymentMethod.Remove(paymentMethod);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PaymentMethodDTO>> GetPaymentMethods(int driverId)
        {
            return await _context.PaymentMethod
                .Where(pm => pm.DriverID == driverId)
                .Select(pm => new PaymentMethodDTO
                {
                    PaymentId = pm.PaymentId,
                    DriverID = pm.DriverID,
                    PaymentType = pm.PaymentType,
                    CardNumber = pm.CardNumber,
                    ExpiryDate = pm.ExpiryDate,
                    CVV = pm.CVV,
                    CardName = pm.CardName
                })
                .ToListAsync();
        }

        public async Task<bool> AddNewCar(int driverId, VehicleDto vehicleDto)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(driverId);
                if (driver == null)
                {
                    return false;
                }

                var vehicle = new Vehicle
                {
                    Model = vehicleDto.Model,
                    Make = vehicleDto.Make,
                    Year = vehicleDto.Year,
                    Color = vehicleDto.Color,
                    LicensePlateNumber = vehicleDto.LicensePlateNumber,
                    NumberOfSeats = vehicleDto.NumberOfSeats,
                    VehicleStatus = vehicleDto.VehicleStatus,
                    InsuranceExpiryDate = vehicleDto.InsuranceExpiryDate,
                    RegistrationExpiryDate = vehicleDto.RegistrationExpiryDate,
                    DriverID = driverId
                };

                // Save the first vehicle photo
                string vehiclePhoto1FileName = $"{driverId}_vehicle.jpg";
                string vehiclePhotosDirectoryPath1 = @"C:/Users/ardit/Desktop/vehicle/first";
                if (!Directory.Exists(vehiclePhotosDirectoryPath1))
                {
                    Directory.CreateDirectory(vehiclePhotosDirectoryPath1);
                }
                string vehiclePhoto1FilePath = Path.Combine(vehiclePhotosDirectoryPath1, vehiclePhoto1FileName);
                using (var stream = new FileStream(vehiclePhoto1FilePath, FileMode.Create))
                {
                    await vehicleDto.photo1.CopyToAsync(stream);
                }
                vehicle.ProfilePicture1Path = vehiclePhoto1FilePath;

                // Save the second vehicle photo if it exists
                if (vehicleDto.photo2 != null)
                {
                    string vehiclePhoto2FileName = $"{driverId}_vehicle.jpg";
                    string vehiclePhotosDirectoryPath2 = @"C:/Users/ardit/Desktop/vehicle/second";
                    if (!Directory.Exists(vehiclePhotosDirectoryPath2))
                    {
                        Directory.CreateDirectory(vehiclePhotosDirectoryPath2);
                    }
                    string vehiclePhoto2FilePath = Path.Combine(vehiclePhotosDirectoryPath2, vehiclePhoto2FileName);
                    using (var stream = new FileStream(vehiclePhoto2FilePath, FileMode.Create))
                    {
                        await vehicleDto.photo2.CopyToAsync(stream);
                    }
                    vehicle.ProfilePicture2Path = vehiclePhoto2FilePath;
                }

                // Save the third vehicle photo if it exists
                if (vehicleDto.photo3 != null)
                {
                    string vehiclePhoto3FileName = $"{driverId}_vehicle.jpg";
                    string vehiclePhotosDirectoryPath3 = @"C:/Users/ardit/Desktop/vehicle/third";
                    if (!Directory.Exists(vehiclePhotosDirectoryPath3))
                    {
                        Directory.CreateDirectory(vehiclePhotosDirectoryPath3);
                    }
                    string vehiclePhoto3FilePath = Path.Combine(vehiclePhotosDirectoryPath3, vehiclePhoto3FileName);
                    using (var stream = new FileStream(vehiclePhoto3FilePath, FileMode.Create))
                    {
                        await vehicleDto.photo3.CopyToAsync(stream);
                    }
                    vehicle.ProfilePicture3Path = vehiclePhoto3FilePath;
                }

                await _context.Vehicles.AddAsync(vehicle);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                // Optionally log the exception
                throw;
            }
        }

        public async Task<List<Vehicle>> ViewCars(int driverId)
        {
            var cars = await _context.Vehicles.Where(v => v.DriverID == driverId).ToListAsync();
            return cars;
        }

        public async Task<List<Ride>> ViewRides(int driverId)
        {
            var rides = await _context.Rides.Where(r => r.DriverID == driverId).ToListAsync();
            return rides;
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

        public async Task<IEnumerable<FeedbackDTO>> GetDriverFeedbacks(int driverId)
        {
            return await _context.Feedbacks
                .Where(f => f.DriverID == driverId)
                .Select(f => new FeedbackDTO
                {
                    RiderID = f.RiderID,
                    DriverID = f.DriverID,
                    RideID = f.RideID,
                    DriverRating = f.DriverRating,
                    DriverComment = f.DriverComment
                })
                .ToListAsync();
        }
    }
}
