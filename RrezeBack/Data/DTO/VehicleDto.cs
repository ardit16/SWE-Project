public class VehicleDto
{
    public string Model { get; set; }
    public string Make { get; set; }
    public int Year { get; set; }
    public string Color { get; set; }
    public string LicensePlateNumber { get; set; }
    public int NumberOfSeats { get; set; }
    public string VehicleStatus { get; set; } 
    public string InsuranceExpiryDate { get; set; }
    public string RegistrationExpiryDate { get; set; }

    public IFormFile? photo1 { get; set; }
    public IFormFile? photo2 { get; set; }
    public IFormFile? photo3 { get; set; }
}
