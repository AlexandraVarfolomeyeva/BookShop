using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Models
{
   public class Order
    {
        public Order()
        {
            BookOrders = new HashSet<BookOrder>();
        }
        
        public int Id { get; set; }
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
