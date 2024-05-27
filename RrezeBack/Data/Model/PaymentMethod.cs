using RrezeBack.Data.Model;
using System.ComponentModel.DataAnnotations;

public class PaymentMethod
{
    [Key]
    public int PaymentId { get; set; }
    public string PaymentType { get; set; }
    public string CardNumber { get; set; }
    public string ExpiryDate { get; set; }
    public string CVV { get; set; }
    public string CardName { get; set; }
    public int RiderID { get; set; }
    public Rider Rider { get; set; }
   
}
