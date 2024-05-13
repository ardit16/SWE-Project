using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace NestQuest.Data.DTO
{
    public class SignUpRiderDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Phone { get; set; }
        
        public string Birthday { get; set; }
        public bool Two_Fa { get; set; }
        
        public bool Gender { get; set; }

        
        public IFormFile? photo { get; set; }
    }
}
