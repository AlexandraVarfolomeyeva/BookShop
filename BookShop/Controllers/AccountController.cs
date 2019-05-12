﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookShop.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookShop.Controllers
{
    public delegate Task<IActionResult> OrderDelegate(Order order); //делегат создания нового заказа
    public delegate Task<string> IdDelegate(); //делегат получения id текущего пользователя

    [Produces("application/json")]
    public class AccountController : Controller
    {
        public static event OrderDelegate OrderEvent;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AccountController(UserManager<User> userManager,
        SignInManager<User> signInManager)
        {
            OrdersController.IDEvent += new IdDelegate(GetIdUserAsync);//присоединение метода к событию
           
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [HttpPost]
        [Route("api/Account/Register")]
        public async Task<IActionResult> Register([ FromBody ]
            RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {//добавление нового пользователя при регистрации
                User user = new User
                {
                    Fio = model.Fio,
                    Email = model.Email,
                    UserName = model.UserName,
                    PhoneNumber = model.PhoneNumber,
                    PhoneNumberConfirmed = true,
                    Address = model.Address
                };
                // Добавление нового пользователя
                var result = await _userManager.CreateAsync(user,
                model.Password);
                if (result.Succeeded)//если успешно
                {
                    await _userManager.AddToRoleAsync(user, "user");//роль - пользователь
                    Order order = new Order() //при регистрации создается новый заказ, актуальность которого =1
                    {
                        UserId = user.Id,
                        SumOrder = 0,
                        SumDelivery = 50,
                        DateOrder = new DateTime(),
                        DateDelivery = DateTime.Now,
                        Active = 1,
                        User = user
                    };
                    await OrderEvent(order);//асинхронное создание заказа
                    // установка куки
                    await _signInManager.SignInAsync(user, false);
                    var msg = new
                    {
                        message = "Добавлен новый пользователь: " + user.UserName
                    };
                    return Ok(msg);
                }
                else
                {//вывод ошибок при неудаче
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty,
                        error.Description);
                    }
                    var errorMsg = new
                    {
                        message = "Пользователь не добавлен.",
                        error = ModelState.Values.SelectMany(e =>
                        e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {//если неверно введены данные
                var errorMsg = new
                {
                    message = "Неверные входные данные.",
                    error = ModelState.Values.SelectMany(e =>
                    e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        [HttpPost]

        [Route("api/Account/Login")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {//вход в систему
            if (ModelState.IsValid)
            {
                var result =
                await  _signInManager.PasswordSignInAsync(model.User, model.Password,
                model.RememberMe, false);
                if (result.Succeeded)//если успешно
                {
                    var msg = new
                    {
                        message = "Выполнен вход пользователем: " +
                    model.User
                    };
                    return Ok(msg);
                }
                else
                {//если неудачно
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.",
                        error = ModelState.Values.SelectMany(e =>
                        e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.",
                    error = ModelState.Values.SelectMany(e =>
                    e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }
        [HttpPost]
        [Route("api/Account/LogOff")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {//выход из системы
            // Удаление куки
            await _signInManager.SignOutAsync();
            var msg = new
            {

                message = "Выполнен выход."
            };
            return Ok(msg);
        }

        string id="";
        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogisAuthenticatedOff()
        {//сообщение об авторизации пользователем
            User usr = await GetCurrentUserAsync(); //получение текущего пользователя
            var message = usr == null ? "Вы Гость. Пожалуйста, выполните вход." :  "Вы вошли как: " + usr.UserName;
            if (usr !=null) id = usr.Id;
            var msg = new
            {
                message
            };
            return Ok(msg);
        }
        private Task<User> GetCurrentUserAsync() =>
        _userManager.GetUserAsync(HttpContext.User);
       

        public async Task<string> GetIdUserAsync()
        {//получение id текущего пользователя
            await LogisAuthenticatedOff();
            return id;
        }
    }

}