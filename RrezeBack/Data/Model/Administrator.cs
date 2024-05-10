using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Administrator
    {
        [Key]
        public int AdministratorID { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Surname { get; set; }

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; }

        public ICollection<Driver> Drivers { get; set; }
        public ICollection<Rider> Riders { get; set; }
    }
}
