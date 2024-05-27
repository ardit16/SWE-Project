using RrezeBack.Data.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace RrezeBack.Data.DTO
{
    public class FeedbackDTO
    {
        public int RideID { get; set; }
        public int DriverID { get; set; }
        public int RiderID { get; set; }
        public int? DriverRating { get; set; }
        public string? DriverComment { get; set; }
        public int? RiderRating { get; set; }
        public string? RiderComment { get; set; }
    }
}
