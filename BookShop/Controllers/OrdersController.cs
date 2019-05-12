﻿using System;
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
    public class OrdersController : ControllerBase
    {
        private readonly BookingContext _context;
        public OrdersController(BookingContext context)
        {
            _context = context; // получаем контекст базы данных
            AccountController.OrderEvent += new OrderDelegate(Create); //получаем id текущего пользователя из AccountController
        }
        public static event IdDelegate IDEvent; //событие по получению id текущего пользователя из AccountController


        [HttpGet]
       public IEnumerable<Order> GetAll() //получить все заказы
        {
           string id = IDEvent().Result; //получаем id текущего пользователя из AccountController
            try
            {//возвращаем список всех заказов для текущего пользователя
              return _context.Order.Include(p => p.BookOrders).Where(p => p.UserId == id);
            
            } catch
            {//если что-то пошло не так, выводим исключение в консоль
                Console.WriteLine("Возникла ошибка при получении списка всех заказов.");
                return null;
            }
        }
             
        

        [HttpGet("{id}")]
        //получить заказ по его id
        public async Task<IActionResult> GetOrder([FromRoute] int id)
        {
            //получить заказ по id заказа
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var order = await _context.Order.SingleOrDefaultAsync(m => m.Id == id);
            if (order == null)//если ничего не получили -- не найдено
            {
                return NotFound();
            }
            return Ok(order);//возвращием заказ
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {//создать новый заказ
            //получаем данные о заказе во входных параметрах
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.Order.Add(order); //добавление заказа в БД
            await _context.SaveChangesAsync();//асинхронное сохранение изменений
            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Order order)
        {//обновить существующий заказ
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Order.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            item.BookOrders = order.BookOrders;
            item.DateDelivery = order.DateDelivery;
            item.DateOrder = order.DateOrder;
            item.SumDelivery = order.SumDelivery;
            item.SumOrder = order.SumOrder;
            _context.Order.Update(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {//удаление заказа
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Order.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.Order.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
