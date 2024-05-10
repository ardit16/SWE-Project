using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class VehicleImages
    {
        [Key]
        public int VehicleImagesID { get; set; }

        public int VehicleID { get; set; }
        [ForeignKey("VehicleID")]
        public Vehicle Vehicle { get; set; }

        public IFormFile Image { get; set; }
    }
}
