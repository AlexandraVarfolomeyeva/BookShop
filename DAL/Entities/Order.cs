using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
   public class Order
    {
         Order()
        {
            BookOrders = new HashSet<BookOrder>();
        }
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public DateTime DateDelivery { get; set; }//дата доставки
        public DateTime DateOrder { get; set; }//дата заказа
        public int SumOrder { get; set; } //стоимость заказа
        public int SumDelivery { get; set; } //стоимость доставки
        public int Active { get; set; } //является ли заказ активным
        //public string Url { get; set; }
        public virtual ICollection<BookOrder> BookOrders { get; set; }
        public virtual User User { get; set; }
    }
}
