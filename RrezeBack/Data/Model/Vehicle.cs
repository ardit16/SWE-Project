using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Vehicle
    {
        [Key]
        public int VehicleID { get; set; }
        public string Model { get; set; }        
        public string Make { get; set; }        
        public int Year { get; set; }       
        public string Color { get; set; }
        public string LicensePlateNumber { get; set; }
        public int NumberOfSeats { get; set; }
        public string VehicleStatus { get; set; }        
        public string InsuranceExpiryDate { get; set; }
        public string RegistrationExpiryDate { get; set; }

        public int DriverID { get; set; }
        [ForeignKey("DriverID")]
        public Driver Driver { get; set; }
        public string ProfilePicture1Path { get; internal set; }
        public string? ProfilePicture2Path { get; internal set; }
        public string? ProfilePicture3Path { get; internal set; }
    }
}
