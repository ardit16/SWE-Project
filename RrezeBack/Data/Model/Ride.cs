using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Ride
    {
        [Key]
        public int RideID { get; set; }

       
        public double PickupLocationLONG { get; set; }
        public double PickupLocationLAT { get; set; }
        public string PickUpName { get; set; }


        public double DropOffLocationLONG { get; set; }
        public double DropOffLocationLAT { get; set; }
        public string DropOffName { get; set; }

        public string RideDate { get; set; }

        
        public string RideStartTime { get; set; }
        public string RideEndTime { get; set; }
        public bool RideStatus { get; set; }        
        public double RideDistance { get; set; }
        public double Amount { get; set; }

        [ForeignKey("DriverID")]
        public int DriverID { get; set; }

        [ForeignKey("RiderID")]
        public int RiderID { get; set; }

        public ICollection<Feedbacks> Feedbacks { get; set; }
    }
}
