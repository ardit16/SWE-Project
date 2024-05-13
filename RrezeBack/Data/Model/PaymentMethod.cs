using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RrezeBack.Data.Model
{
    public class PaymentMethod
    {
        [Key]
        public string PaymentId { get; set; }
        public string Amount { get; set; }
        public string PaymentType { get; set; }

        public string CardNumber { get; set; }


        public string ExpiryDate { get; set; }


        public string CVV { get; set; }


        public string CardName { get; set; }
        public int RiderID { get; set; }
        [ForeignKey("RiderID")]
        public Rider Rider { get; set; }

        public int DriverID { get; set; }
        [ForeignKey("DriverID")]
        public Driver Driver { get; set; }

        public int RideID { get; set; }
        [ForeignKey("RideID")]
        public Ride Ride { get; set; }
    }
}
