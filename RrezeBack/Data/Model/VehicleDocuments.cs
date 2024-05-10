using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class VehicleDocuments
    {
        [Key]
        public int VehicleDocumentsID { get; set; }

        public int VehicleID { get; set; }
        [ForeignKey("VehicleID")]
        public Vehicle Vehicle { get; set; }

        public IFormFile Document { get; set; }
    }
}
