using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RrezeBack.Data.Model
{
    public class Rider
    {
        [Key]
        public int RiderID { get; set; }

        public string Email { get; set; }       
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }        
        public string Birthday { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public float ovrating { get; set; }
        public string? ProfilePicturePath { get; set; }
       
        
        public DateTime DateAdded { get; set; }

        public ICollection<Ride> Rides { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<PaymentMethod> PaymentMethods { get; set; }
        


    }

}
