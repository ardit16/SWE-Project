﻿using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using RrezeBack.Data.DTO;
using RrezeBack.Data.Model;
using System.Security.Cryptography;
using System.Linq;
using System.Threading.Tasks;


namespace RrezeBack.Services
{ 
    public interface IRiderService
    {
    Task<RiderDTO> GetRiderProfile(int riderId);
    Task<bool> ChangeTwoFactorAuthentication(int riderId, bool enable2FA);
    Task<int> ChangePassword(ChangePasswordDto dto);
    Task<Ride> RequestRide(RideDTO rideRequestDto);
    Task<int> CancelRide(int Riderid);
    Task<bool> SubmitFeedback(FeedbackDTO feedbackDto);
    Task<bool> AddPaymentMethod(PaymentMethodDTO paymentMethodDto);
    Task<bool> DeletePaymentMethod(int riderId, int paymentMethodId);
    Task<IEnumerable<PaymentMethodDTO>> GetPaymentMethods(int riderId);
    Task<float> CheckRating(int riderId);
    Task<IEnumerable<RideDTO>> GetPreviousRidesAsync(int riderId);
    Task<bool> UpdateProfilePicture(ProfilePictureDto profilePictureDto);
    Task<IEnumerable<FeedbackDTO>> GetRiderFeedbacks(int riderId);
    Task<RideDTO> GetRideStatus(int rideId);
    Task<bool> DeleteRide(int rideId);
        Task<IEnumerable<RideDTO>> GetPendingRides(int riderId);
    }
    public class RiderService : IRiderService
    {
        private readonly DBContext _context;

        public RiderService(DBContext context)
        {
            _context = context;
        }

        public async Task<RiderDTO> GetRiderProfile(int riderId)
        {
            var rider = await _context.Riders.FindAsync(riderId);
            if (rider == null) return null;

            return new RiderDTO
            {
                RiderID = rider.RiderID,
                Email = rider.Email,
                Name = rider.Name,
                Surname = rider.Surname,
                PhoneNumber = rider.PhoneNumber,
                Birthday = rider.Birthday,
                TwoFactorEnabled = rider.TwoFactorEnabled,
                Ovrating = rider.ovrating
            };
        }
        public async Task<bool> ChangeTwoFactorAuthentication(int riderId, bool enable2FA)
        {
            var rider = await _context.Riders.FindAsync(riderId);
            if (rider == null)
            {
                return false;
            }
            rider.TwoFactorEnabled = enable2FA;
            await _context.SaveChangesAsync();
            return true;
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
        public async Task<int> ChangePassword(ChangePasswordDto dto)
        {
            try
            {
                var rezult = await _context.Riders
                        .Where(u => u.RiderID == dto.Id)
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
        public async Task<Ride> RequestRide(RideDTO rideRequestDto)
        {
            try
            {
                var ride = new Ride
                {
                    RiderID = rideRequestDto.RiderID,
                    PickupLocationLONG = rideRequestDto.PickupLocationLONG,
                    PickupLocationLAT = rideRequestDto.PickupLocationLAT,
                    PickUpName = rideRequestDto.PickUpName,
                    DropOffLocationLONG = rideRequestDto.DropOffLocationLONG,
                    DropOffLocationLAT = rideRequestDto.DropOffLocationLAT,
                    DropOffName = rideRequestDto.DropOffName,
                    RideDate = rideRequestDto.RideDate,
                    RideStartTime = rideRequestDto.RideStartTime,
                    RideStatus = false,
                    Amount = rideRequestDto.Amount,
                    RideDistance = rideRequestDto.RideDistance,
                    RideEndTime = rideRequestDto.RideEndTime,
                    DriverID = rideRequestDto.DriverId,
                };

                _context.Rides.Add(ride);
                await _context.SaveChangesAsync();

                return ride; // Return the created ride object
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return null;
            }
        }

        public async Task<int> CancelRide(int rideId)
        {
            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null) return 0;

            _context.Rides.Remove(ride);
            await _context.SaveChangesAsync();

            return 1;
        }
        public async Task<bool> SubmitFeedback(FeedbackDTO feedbackDto)
        {
            // Check if the RideID exists
            var ride = await _context.Rides.FindAsync(feedbackDto.RideID);
            if (ride == null)
            {
                throw new Exception("Ride not found");
            }

            // Check if the DriverID exists
            var driver = await _context.Drivers.FindAsync(feedbackDto.DriverID);
            if (driver == null)
            {
                throw new Exception("Driver not found");
            }

            // Check if the RiderID exists
            var rider = await _context.Riders.FindAsync(feedbackDto.RiderID);
            if (rider == null)
            {
                throw new Exception("Rider not found");
            }

            var feedback = new Feedbacks
            {
                RideID = feedbackDto.RideID,
                RiderRating = feedbackDto.RiderRating,
                RiderComment = feedbackDto.RiderComment,
                DriverID = feedbackDto.DriverID,
                RiderID = feedbackDto.RiderID
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> AddPaymentMethod(PaymentMethodDTO paymentMethodDto)
        {
            var rider = await _context.Riders.FindAsync(paymentMethodDto.RiderID);

            if (rider == null)
            {
                throw new Exception($"Rider with ID {paymentMethodDto.RiderID} not found");
            }

            var paymentMethod = new PaymentMethod
            {
                RiderID = paymentMethodDto.RiderID,
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

        public async Task<bool> DeletePaymentMethod(int riderId, int paymentMethodId)
        {
            var paymentMethod = await _context.PaymentMethod
                .FirstOrDefaultAsync(pm => pm.RiderID == riderId && pm.PaymentId == paymentMethodId);

            if (paymentMethod == null)
            {
                return false;
            }

            _context.PaymentMethod.Remove(paymentMethod);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PaymentMethodDTO>> GetPaymentMethods(int riderId)
        {
            return await _context.PaymentMethod
                .Where(pm => pm.RiderID == riderId)
                .Select(pm => new PaymentMethodDTO
                {
                    PaymentId = pm.PaymentId,
                    RiderID = pm.RiderID,
                    PaymentType = pm.PaymentType,
                    CardNumber = pm.CardNumber,
                    ExpiryDate = pm.ExpiryDate,
                    CVV = pm.CVV,
                    CardName = pm.CardName
                })
                .ToListAsync();
        }
        public async Task<float> CheckRating(int riderId)
        {
            // Fetch all feedbacks for the given rider
            var feedbacks = await _context.Feedbacks
                                          .Where(f => f.RiderID == riderId)
                                          .ToListAsync();

            // If there are no feedbacks, return 0
            if (feedbacks == null || !feedbacks.Any())
            {
                return 0;
            }

            // Calculate the average rating
            float averageRating = (float)feedbacks.Average(f => f.RiderRating ?? 0);

            return averageRating;
        }
        public async Task<IEnumerable<RideDTO>> GetPreviousRidesAsync(int riderId)
        {
            return await _context.Rides
                .Where(r => r.RiderID == riderId)
                .Select(r => new RideDTO
                {
                    RideID = r.RideID,
                    PickupLocationLONG = r.PickupLocationLONG,
                    PickupLocationLAT = r.PickupLocationLAT,
                    PickUpName = r.PickUpName,
                    DropOffLocationLONG = r.DropOffLocationLONG,
                    DropOffLocationLAT = r.DropOffLocationLAT,
                    DropOffName = r.DropOffName,
                    RideDate = r.RideDate,
                    RideStartTime = r.RideStartTime,
                    RideEndTime = r.RideEndTime,
                    RideStatus = r.RideStatus,
                    RideDistance = r.RideDistance,
                    Amount = r.Amount
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateProfilePicture(ProfilePictureDto profilePictureDto)
        {
            var rider = await _context.Riders.FindAsync(profilePictureDto.RiderId);
            if (rider == null) return false;

            string photosDirectoryPath = @"C:\Users\ardit\Desktop\photo\rider\pfp"; 
            string fileName = $"{profilePictureDto.RiderId}.jpg";
            string filePath = Path.Combine(photosDirectoryPath, fileName);

            // Ensure the directory exists
            if (!Directory.Exists(photosDirectoryPath))
            {
                Directory.CreateDirectory(photosDirectoryPath);
            }

            // Save the profile picture to the file system
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await profilePictureDto.ProfilePicture.CopyToAsync(stream);
            }

            // Update the rider's profile picture path in the database
            rider.ProfilePicturePath = filePath;
            _context.Riders.Update(rider);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<FeedbackDTO>> GetRiderFeedbacks(int riderId)
        {
            return await _context.Feedbacks
                .Where(f => f.RiderID == riderId)
                .Select(f => new FeedbackDTO
                {
                    RiderID = f.RiderID,
                    DriverID = f.DriverID,
                    RideID = f.RideID,
                    RiderRating = f.RiderRating,
                    RiderComment = f.RiderComment
                })
                .ToListAsync();
        }

        public async Task<RideDTO> GetRideStatus(int rideId)
        {
            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null)
            {
                return null;
            }

            return new RideDTO
            {
                RideID = ride.RideID,
                RideStatus = ride.RideStatus
            };
        }

        public async Task<bool> DeleteRide(int rideId)
        {
            var ride = await _context.Rides.FindAsync(rideId);
            if (ride == null)
            {
                return false;
            }

            _context.Rides.Remove(ride);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RideDTO>> GetPendingRides(int riderId)
        {
            return await _context.Rides
                .Where(r => r.RiderID == riderId && r.RideStatus == false)
                .Select(r => new RideDTO
                {
                    RideID = r.RideID,
                    PickupLocationLONG = r.PickupLocationLONG,
                    PickupLocationLAT = r.PickupLocationLAT,
                    PickUpName = r.PickUpName,
                    DropOffLocationLONG = r.DropOffLocationLONG,
                    DropOffLocationLAT = r.DropOffLocationLAT,
                    DropOffName = r.DropOffName,
                    RideDate = r.RideDate,
                    RideStartTime = r.RideStartTime,
                    RideEndTime = r.RideEndTime,
                    RideStatus = r.RideStatus,
                    RideDistance = r.RideDistance,
                    Amount = r.Amount,
                    DriverId = r.DriverID,
                    RiderID = r.RiderID
                })
                .ToListAsync();
        }

    }

}
