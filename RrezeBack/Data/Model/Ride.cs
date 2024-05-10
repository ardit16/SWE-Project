using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Ride
    {
        [Key]
        public int RideID { get; set; }

        [Required]
        public string PickupLocation { get; set; }

        [Required]
        public string DropOffLocation { get; set; }

        [Required]
        public DateTime RideDate { get; set; }

        [Required]
        public DateTime RideStartTime { get; set; }

        [Required]
        public DateTime RideEndTime { get; set; }

        [Required]
        public decimal Fare { get; set; }

        [Required]
        public string RideStatus { get; set; }

        [Required]
        public double RideDistance { get; set; }

        public int DriverID { get; set; }
        [ForeignKey("DriverID")]
        public Driver Driver { get; set; }

        public int RiderID { get; set; }
        [ForeignKey("RiderID")]
        public Rider Rider { get; set; }

        public int PaymentMethodID { get; set; }
        [ForeignKey("PaymentMethodID")]
        public PaymentMethod PaymentMethod { get; set; }

        public ICollection<Feedbacks> Feedbacks { get; set; }
    }
}
