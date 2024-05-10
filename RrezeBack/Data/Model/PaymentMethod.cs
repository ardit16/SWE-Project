using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class PaymentMethod
    {
        [Key]
        public int PaymentMethodID { get; set; }

        [Required]
        public string PaymentType { get; set; }

        [Required]
        [CreditCard]
        public string CardNumber { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public string CVV { get; set; }

        [Required]
        public string CardName { get; set; }

        public ICollection<Rider> Riders { get; set; }
        public ICollection<Driver> Drivers { get; set; }
    }
}
