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
            try {
                return _context.Book.Include(p=>p.BookOrders);
            } catch (Exception ex)
            {
                Log.Write(ex);
                return null;
            }
            
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook([FromRoute] int id)
        {//получение книги по id
            try
            {
                if (!ModelState.IsValid)
                {
                    Log.WriteSuccess(" BooksController.GetBook", "Валидация внутри контроллера неудачна.");
                    return BadRequest(ModelState);
                }

                var item = await _context.Book.SingleOrDefaultAsync(m => m.Id == id);

                if (item == null)
                {
                    Log.WriteSuccess(" BooksController.GetBook", "Книга не найдена.");
                    return NotFound();
                }
                return Ok(item);
            } catch(Exception ex)
            {
                Log.Write(ex);
                return BadRequest(ModelState);
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Book item)
        {//создание новой книги возможно только администратором
            try
            {
                if (!ModelState.IsValid)
                {
                    Log.WriteSuccess(" BooksController.Create", "Валидация внутри контроллера неудачна.");
                    return BadRequest(ModelState);
                }

                _context.Book.Add(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBook", new { id = item.Id }, item);
            } catch (Exception ex)
            {
                Log.Write(ex);
                return BadRequest(ModelState);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Book book)
        {//обновление информации о существующей книге возможно только администратором
          try{  if (!ModelState.IsValid)
            {
                Log.WriteSuccess(" BooksController.Update", "Валидация внутри контроллера неудачна.");
                return BadRequest(ModelState);
            }
            var item = _context.Book.Find(id);
            if (item == null)
            {
                Log.WriteSuccess(" BooksController.Update", "Книга не найдена.");
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
        } catch (Exception ex)
            {
                Log.Write(ex);
                return BadRequest(ModelState);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {//удаление книги из БД возможно только администратором
            try
            {
                if (!ModelState.IsValid)
                {
                    Log.WriteSuccess(" BooksController.Delete", "Валидация внутри контроллера неудачна.");
                    return BadRequest(ModelState);
                }
                var item = _context.Book.Find(id);
                if (item == null)
                {
                    Log.WriteSuccess(" BooksController.Delete", "Книга не найдена.");
                    return NotFound();
                }
                _context.Book.Remove(item);
                await _context.SaveChangesAsync();
                return NoContent();
            } catch (Exception ex)
            {
                Log.Write(ex);
                return BadRequest(ModelState);
            }
        }
    }
}
