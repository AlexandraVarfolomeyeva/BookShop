using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookShop.Controllers
{
    [Route("api/[controller]")]
    public class ViewController : Controller
    {
        private readonly BookingContext _context;
        public ViewController(BookingContext context)
        {
            _context = context;
        }


        // GET: api/<controller>
        [HttpGet]
        public IEnumerable<BookView> GetAllView() //получение списка всех книг
        {
            try
            {
                IEnumerable<Book> books = _context.Book.Include(p => p.BookOrders);
                BookView[] bookViews = new BookView[books.Count()];
                int i = 0;
                foreach (Book item in books)
                {
                    bookViews[i] = new BookView();
                    bookViews[i].Id = item.Id;
                    bookViews[i].image = item.image;
                    bookViews[i].Stored = item.Stored;
                    bookViews[i].Title = item.Title;
                    bookViews[i].Year = item.Year;
                    bookViews[i].Cost = item.Cost;
                    bookViews[i].Content = item.Content;
                    Publisher publisher = _context.Publisher.Find(item.IdPublisher);
                    List<string> au = new List<string>(); ;
                    bookViews[i].Publisher = publisher.Name;
                    IEnumerable<BookAuthor> bookauthors = _context.BookAuthor.Where(b => b.IdBook == item.Id);
                    IEnumerable<BookGenre> bookgenres = _context.BookGenre.Where(b => b.IdBook==item.Id);
                    foreach (BookAuthor line in bookauthors)
                    {
                            Author author = _context.Author.Find(line.IdAuthor);
                            au.Add(author.Name);
                    }
                    bookViews[i].Authors = au.ToArray();
                    foreach (BookGenre line in bookgenres)
                    {
                            Genre genre = _context.Genre.Find(line.IdGenre);
                            au.Add(genre.Name);
                    }
                    bookViews[i].Genres = au.ToArray();
                    i++;
                }
                IEnumerable<BookView> views = bookViews;
                return views;
            }
            catch (Exception ex)
            {
                Log.Write(ex);
                return null;
            }

        }

    }
}
