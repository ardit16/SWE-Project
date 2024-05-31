using RrezeBack.Data.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PaymentMethod
{
    [Key]
    public int PaymentId { get; set; }
    public string PaymentType { get; set; }
    public string CardNumber { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public string CardName { get; set; }


    public int? RiderID { get; set; }
    public int? DriverID { get; set; }


    [ForeignKey("RiderID")]
    public Rider Rider { get; set; }


}
