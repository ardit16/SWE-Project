namespace RrezeBack.Data.DTO
{
    public class RideDTO
    {
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
        public int? DriverId { get; set; }
        public int? RiderID { get; set; }
    }
}
