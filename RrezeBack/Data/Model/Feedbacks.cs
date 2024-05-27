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

        [ForeignKey("DriverID")]
        public int DriverID { get; set; }

        [ForeignKey("RiderID")]
        public int RiderID { get; set; }

        [ForeignKey("RideID")]
        public int RideID { get; set; }

        public Driver Driver { get; set; }
        public Rider Rider { get; set; }
        public Ride Ride { get; set; }
    }
}
