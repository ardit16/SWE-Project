﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Ride
    {
        [Key]
        public int RideID { get; set; }

       
        public double PickupLocationLONG { get; set; }
        public double PickupLocationLAT { get; set; }


        public double DropOffLocationLONG { get; set; }
        public double DropOffLocationLAT { get; set; }

        
        public string RideDate { get; set; }

        
        public string RideStartTime { get; set; }

       
        public string RideEndTime { get; set; }

        

        
        public bool RideStatus { get; set; }

        
        public double RideDistance { get; set; }
        public string PaymentType { get; set; }

        public string Amount { get; set; }

        public string CardNumber { get; set; }


        public string ExpiryDate { get; set; }


        public string CVV { get; set; }


        public string CardName { get; set; }

        public int DriverID { get; set; }
        [ForeignKey("DriverID")]
        public Driver Driver { get; set; }

        public int RiderID { get; set; }
        [ForeignKey("RiderID")]
        public Rider Rider { get; set; }

        

        public ICollection<Feedbacks> Feedbacks { get; set; }
    }
}