using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Administrator
    {
        [Key]
        public int AdministratorID { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string PhoneNumber { get; set; }

        public string Birthday { get; set; }


        public ICollection<Driver> Drivers { get; set; }
        public ICollection<Rider> Riders { get; set; }
        public ICollection<Ride> Rides { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<PaymentMethod> PaymentMethods { get; set; }

    }
}
