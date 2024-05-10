namespace RrezeBack.Data.DTO
{
    public class SignUpDriverDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Birthday { get; set; }
        public bool Two_Fa { get; set; }
        public string Gender { get; set; }
        public IFormFile photo { get; set; }
        
       
    }
}
