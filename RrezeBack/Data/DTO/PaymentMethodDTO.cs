namespace RrezeBack.Data.DTO
{
    public class PaymentMethodDTO
    {
        public string PaymentId { get; set; }
        public string Amount { get; set; }
        public string PaymentType { get; set; }
        public string? CardNumber { get; set; }
        public string? ExpiryDate { get; set; }
        public string? CVV { get; set; }
        public string? CardName { get; set; }
    }

}
