namespace RrezeBack.Data.DTO
{
    public class DriverDTO 
    {
        public int DriverID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Birthday { get; set; }
        public string PhoneNumber { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool status { get; set; }
        public bool Verified { get; set; }
        public float ovrating { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
