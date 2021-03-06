﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
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
