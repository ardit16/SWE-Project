using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RrezeBack.Data.Model
{
    public class Rider
    {
        [Key]
        public int RiderID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Surname { get; set; }

        public FormFile ProfilePhoto { get; set; }

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [EmailAddress]
        public string Password { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        public string PasswordHash { get; set; } // Hashed Password

        public bool TwoFactorEnabled { get; set; }
        public string TwoFactorCode { get; set; }
        public DateTime? TwoFactorCodeExpiry { get; set; }

        public int? AdministratorID { get; set; } // Ensure this property exists if needed

        public int PaymentMethodID { get; set; } // Ensure this property exists if needed
        public PaymentMethod PaymentMethod { get; set; }

        public ICollection<Ride> Rides { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<PaymentMethod> PaymentMethods { get; set; }
    }

}
