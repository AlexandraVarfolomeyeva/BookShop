﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace BookingWebAPI.Models
{
   
        public class BookOrder //строка заказа
        {
            [Required]
            [Key]
            public int Id { get; set; }
            [Required]
            [ForeignKey("Book")]
            public int IdBook { get; set; }
            [Required]
            [ForeignKey("Order")]
            public int IdOrder { get; set; }
            public virtual Book Book { get; set; }
            public virtual Order Order { get; set; }
        }
}