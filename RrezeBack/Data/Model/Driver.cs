using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Driver
    {
        [Key]
        public int DriverID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Surname { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string PhoneNumber { get; set; }
        [Required]
        [MaxLength(100)]
        public string Password { get; set; }

        public string ProfilePhoto { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string PasswordHash { get; set; } // Hashed Password

        [Required]
        public IFormFile DriverLicense { get; set; }

        public int PaymentMethodID { get; set; }
        [ForeignKey("PaymentMethodID")]
        public PaymentMethod PaymentMethod { get; set; }

        public bool TwoFactorEnabled { get; set; }
        public string TwoFactorCode { get; set; }
        public DateTime? TwoFactorCodeExpiry { get; set; }

        public int? AdministratorID { get; set; }

        public ICollection<Ride> Rides { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; }
    }
}
