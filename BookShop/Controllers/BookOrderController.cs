using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookShop.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BookOrderController : ControllerBase
    {
        private readonly BookingContext _context;
        public BookOrderController(BookingContext context)
        {
            _context = context;
            
        }

        [HttpGet]
        public IEnumerable<BookOrder> GetAll()
        {//получение всех строк заказа
            return _context.BookOrder;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookOrder([FromRoute] int id)
        {//получение конкретной строки заказа по id
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = await _context.BookOrder.SingleOrDefaultAsync(m => m.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }


    [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Create([FromBody] BookOrder item)
        {//создание новой строки заказа
          //  string id = IDEvent().Result;//получили id пользователя
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _context.BookOrder.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookOrder", new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {//удаление существующей строки заказа
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.BookOrder.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.BookOrder.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
