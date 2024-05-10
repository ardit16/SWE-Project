using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Vehicle
    {
        [Key]
        public int VehicleID { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        public string Make { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        public string LicensePlateNumber { get; set; }

        [Required]
        public int NumberOfSeats { get; set; }

        [Required]
        public string VehicleStatus { get; set; }

        [Required]
        public DateTime InsuranceExpiryDate { get; set; }

        [Required]
        public DateTime RegistrationExpiryDate { get; set; }

        public int DriverID { get; set; }
        [ForeignKey("DriverID")]
        public Driver Driver { get; set; }

        public ICollection<VehicleImages> VehicleImages { get; set; }
        public ICollection<VehicleDocuments> VehicleDocuments { get; set; }
    }
}
