﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    public delegate Task<IActionResult> OrderDelegate(Order order); //делегат создания нового заказа
    public delegate Task<string> IdDelegate(); //делегат получения id текущего пользователя

    [Produces("application/json")]
    public class AccountController : Controller
    {
        public static event OrderDelegate OrderEvent; //событие создания заказа
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
            try
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
                    await _signInManager.SignInAsync(user, false);// установка куки
                    if (result.Succeeded)//если успешно
                    {
                        Log.WriteSuccess("AccountController.Register", "Пользователь добавлен и вошел в систему.");
                        await _userManager.AddToRoleAsync(user, "user");//роль - пользователь
                        
                        var msg = new
                        {
                            message = "Добавлен новый пользователь: " + user.UserName
                        };
                        await CreateFirstOrder(user.Id);
                        return Ok(msg);
                    }
                    else
                    {//вывод ошибок при неудаче
                        foreach (var error in result.Errors)
                        {
                            ModelState.AddModelError(string.Empty,
                            error.Description);
                        }
                        Log.WriteSuccess("AccountController.Register", "Пользователь не добавлен.");
                        var errorMsg = new
                        {
                        message = "Пользователь не добавлен.",
                            error = ModelState.Values.SelectMany(e =>
                            e.Errors.Select(er => er.ErrorMessage))
                        };
                        return BadRequest(errorMsg);
                        //return Ok(errorMsg);
                    }
                }
                else
                {//если неверно введены данные
                    Log.WriteSuccess("AccountController.Register", "Неверные входные данные.");
                    var errorMsg = new
                    {
                        message = "Неверные входные данные.",
                        error = ModelState.Values.SelectMany(e =>
                        e.Errors.Select(er => er.ErrorMessage))
                    };
                    return BadRequest(errorMsg);
                  // return Ok(errorMsg);
                }
            }
            catch (Exception ex)
            {
                Log.Write(ex);
                var errorMsg = new
                {
                    message = "Неверные входные данные.",
                    error = ModelState.Values.SelectMany(e =>
                    e.Errors.Select(er => er.ErrorMessage))
                };
                //return Ok(errorMsg);
                return BadRequest(errorMsg);
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
                    Log.WriteSuccess("AccountController.Login", "Выполнен вход пользователем: " + model.User);
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
                    Log.WriteSuccess("AccountController.Login", "Неправильный логин и (или) пароль.");
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
                Log.WriteSuccess("AccountController.Login", "Вход не выполнен.");
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
            Log.WriteSuccess("AccountController.LogOff", "Выполнен выход.");
            var msg = new
            {

                message = "Выполнен выход."
            };
            return Ok(msg);
        }

        public string id="";
        public string role;
        public IList<string> x;
        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogisAuthenticatedOff()
        {//сообщение об авторизации пользователем
            User usr;
            usr = await GetCurrentUserAsync(); //получение текущего пользователя
            if (usr != null) id = usr.Id;
            var message = usr == null ? "Вы Гость. Пожалуйста, выполните вход." :  "Вы вошли как: " + usr.UserName;
            var msg = new
            {
                message
            };
           
            return Ok(msg);
        }
        private Task<User> GetCurrentUserAsync() =>
        _userManager.GetUserAsync(HttpContext.User);


        [HttpGet]
        [Route("api/Account/WhoisAuthenticated")]
        public async Task<string> GetIdUserAsync()
        {//получение id текущего пользователя
            try
            {
              User usr = await _userManager.GetUserAsync(HttpContext.User);
              if (usr!=null)  id = usr.Id;
              //await LogisAuthenticatedOff();
            }
            catch (Exception ex)
            {
                Log.Write(ex);
            }
            return id;
        }

        [HttpGet]
        [Route("api/Account/GetRole")]
        public async Task<string> GetUserRole()
        {//получение id текущего пользователя

            try
            {
                User usr = await GetCurrentUserAsync();
                if (usr != null)
                {
                    x = await _userManager.GetRolesAsync(usr);
                    role = x.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                Log.Write(ex);
            }
            return role;
        }

        [HttpGet]
        [Route("api/Account/CreateFirstOrder")]
        public async Task<Order> CreateFirstOrder(string id)
        {
            try
            {
                await GetIdUserAsync();
                Order order = new Order() //при регистрации создается новый заказ, актуальность которого =1
                {
                    DateDelivery = DateTime.Now,
                    DateOrder = new DateTime(),
                    SumOrder = 0,
                    SumDelivery = 50,
                    Active = 1,
                    UserId = id
                };
                await OrderEvent(order);//асинхронное создание заказа
                return order;
            }
            catch (Exception ex)
            {
                Log.Write(ex, "First order was not created.");
                return null;
            }
        }

    }

}