using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Feedbacks
    {
        [Key]
        public int FeedbackID { get; set; }

        public int? DriverRating { get; set; }

        public string? DriverComment { get; set; }

        public int? RiderRating { get; set; }

        public string? RiderComment { get; set; }

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
