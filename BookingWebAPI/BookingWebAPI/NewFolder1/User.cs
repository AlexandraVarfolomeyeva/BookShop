using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Identity;

namespace BookingWebAPI.Models
{
    public class User : IdentityUser
    {
        public string Fio { get; set; }
        public string Address { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public User()
        {
            Orders = new HashSet<Order>();
        }
    }
}