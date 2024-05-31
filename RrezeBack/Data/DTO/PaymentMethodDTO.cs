using RrezeBack.Data.Model;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.DTO
{
    public class PaymentMethodDTO
    {
        public int? RiderID { get; set; }
        public int? DriverID { get; set; } 
        public string PaymentType { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
        public string CardName { get; set; }

      

    }

 }
