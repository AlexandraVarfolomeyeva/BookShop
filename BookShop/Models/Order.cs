using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BookShop.Models
{
    public  class Order
    {

        public Order()
        {
            BookOrders = new HashSet<BookOrder>();
        }
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public DateTime DateDelivery { get; set; }
        public DateTime DateOrder { get; set; }
        public int SumOrder { get; set; }
        public int SumDelivery { get; set; }
        public int Active { get; set; }
        //public string Url { get; set; }
        public virtual ICollection<BookOrder> BookOrders { get; set; }
        public virtual User User { get; set; }
    }
}
