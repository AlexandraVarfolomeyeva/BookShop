using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Drawing;
using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookShop.Models
{
    public  class Book
    {
        [Required]
        [Key]
        public int Id { get; set; }
        public string Publisher { get; set; }
        public string image { get; set; }
        public string Year { get; set; }
        public int Cost { get; set; }
        public string Author { get; set; }
        public string Content { get; set; } //Описание (аннотация) книги
        [Required]
        public string Title { get; set; } //Название книги
        
        public virtual ICollection<BookOrder> BookOrders { get; set; }
        public Book()
        {
            BookOrders = new HashSet<BookOrder>();
        }
    }
}
