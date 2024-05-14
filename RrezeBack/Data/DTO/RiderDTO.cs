namespace RrezeBack.Data.DTO
{
    public class RiderDTO
    {
        public int RiderID { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public bool Gender { get; set; }
        public string Birthday { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public float Ovrating { get; set; }
    }
}
