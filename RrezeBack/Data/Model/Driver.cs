﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RrezeBack.Data.Model
{
    public class Driver
    {
        [Key]
        public int DriverID { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Email { get; set; }
        

        public string Password { get; set; }

        public string Birthday { get; set; }

       
        public string PhoneNumber { get; set; }
       
       public string Gender { get; set; }


        public string DriverLicense { get; set; }


        public bool TwoFactorEnabled { get; set; }



        public ICollection<Ride> Rides { get; set; }
        public ICollection<Feedbacks> Feedbacks { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; }
    }
}