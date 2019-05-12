using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookShop.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookingContext _context;
        public BooksController(BookingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Book> GetAll() //получение списка всех книг
        {
            return _context.Book.Include(p=>p.BookOrders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook([FromRoute] int id)
        {//получение книги по id
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = await _context.Book.SingleOrDefaultAsync(m => m.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Book item)
        {//создание новой книги возможно только администратором
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Book.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Book book)
        {//обновление информации о существующей книге возможно только администратором
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Book.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            item.BookOrders = book.BookOrders;
            item.Content = book.Content;
            item.Cost = book.Cost;
            item.image = book.image;
            item.Publisher = book.Publisher;
            item.Author = book.Author;
            item.Title = book.Title;
            item.Year = book.Year;
            _context.Book.Update(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {//удаление книги из БД возможно только администратором
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Book.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.Book.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
