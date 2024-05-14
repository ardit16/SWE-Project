namespace RrezeBack.Data.DTO
{
    public class RideRequestDTO
    {
       
        public double PickupLocationLONG { get; set; }
        public double PickupLocationLAT { get; set; }
        public string PickUpName { get; set; }

        public double DropOffLocationLONG { get; set; }
        public double DropOffLocationLAT { get; set; }
        public string DropOffName { get; set; }

        public string RideDate { get; set; }
        public string RideStartTime { get; set; }
    }

}
