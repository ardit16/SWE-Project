using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using RrezeBack.Data.DTO;
using RrezeBack.Data.Model;
using System.Security.Cryptography;

namespace RrezeBack.Services
{ 
    public interface IRiderService
    {
    Task<RiderDTO> GetRiderProfile(int riderId);
    Task<bool> UpdateRiderProfile(int Riderid, RiderDTO riderDto);
    Task<int> ChangePassword(ChangePasswordDto changePasswordDto);
    Task<bool> RequestRide(RideDTO rideRequestDto);
    Task<int> CancelRide(int Riderid);
    Task<bool> SubmitFeedback(FeedbackDTO feedbackDto);
    Task<bool> AddPaymentMethod(int riderId, PaymentMethodDTO paymentMethodDto);
    Task<float> CheckRating(int riderId);
    Task<IEnumerable<RideDTO>> GetPreviousRidesAsync(int riderId);
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
                Gender = rider.Gender,
                Birthday = rider.Birthday,
                TwoFactorEnabled = rider.TwoFactorEnabled,
                Ovrating = rider.ovrating
            };
        }

        public async Task<bool> UpdateRiderProfile(int id,RiderDTO riderDto)
        {
            var rider = await _context.Riders.FindAsync(riderDto.RiderID);
            if (rider == null) return false;

            rider.Email = riderDto.Email;
            rider.Name = riderDto.Name;
            rider.Surname = riderDto.Surname;
            rider.PhoneNumber = riderDto.PhoneNumber;
            rider.Gender = riderDto.Gender;
            rider.Birthday = riderDto.Birthday;
            rider.TwoFactorEnabled = riderDto.TwoFactorEnabled;
            

            _context.Riders.Update(rider);
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

        public async Task<bool> RequestRide(RideDTO rideRequestDto)
        {
            var ride = new Ride
            {
               RiderID= rideRequestDto.RiderID,
                PickupLocationLONG = rideRequestDto.PickupLocationLONG,
                PickupLocationLAT = rideRequestDto.PickupLocationLAT,
                PickUpName = rideRequestDto.PickUpName,
                DropOffLocationLONG = rideRequestDto.DropOffLocationLONG,
                DropOffLocationLAT = rideRequestDto.DropOffLocationLAT,
                DropOffName = rideRequestDto.DropOffName,
                RideDate = rideRequestDto.RideDate,
                RideStartTime = rideRequestDto.RideStartTime,
                RideStatus = false, // Initially false until driver accepts the ride
                Amount = rideRequestDto.Amount,
                RideDistance = rideRequestDto.RideDistance,
                RideEndTime = rideRequestDto.RideEndTime,
                RideID = rideRequestDto.RideID,
            };

            _context.Rides.Add(ride);
            await _context.SaveChangesAsync();

            return true;
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
            var feedback = new Feedbacks
            {
                RideID = feedbackDto.RideID,
                DriverRating = feedbackDto.DriverRating,
                DriverComment = feedbackDto.DriverComment
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AddPaymentMethod(int riderId, PaymentMethodDTO paymentMethodDto)
        {
            var paymentMethod = new PaymentMethod
            {
                PaymentId = paymentMethodDto.PaymentId,
                Amount = paymentMethodDto.Amount,
                PaymentType = paymentMethodDto.PaymentType,
                CardNumber = paymentMethodDto.CardNumber,
                ExpiryDate = paymentMethodDto.ExpiryDate,
                CVV = paymentMethodDto.CVV,
                CardName = paymentMethodDto.CardName,
                RiderID = riderId
            };

            _context.PaymentMethod.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return true;
        }

       

        public async Task<float> CheckRating(int riderId)
        {
            var rider = await _context.Riders.FindAsync(riderId);
            return rider?.ovrating ?? 0;
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
    }

}
