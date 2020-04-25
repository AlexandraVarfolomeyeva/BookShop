﻿const uri = "/api/Books/";
const uriBookOrder = "/api/BookOrder/";
const uriOrders = "/api/Orders/";
const uriPublisher = "/api/Publisher/";
const uriAuthors = "/api/Authors/";
const uriBookAuthor = "/api/BookAuthor/";
const uriBookGenre = "/api/BookGenre/";
const uriView = "/api/View/";
let items = null;
let books = null;
let orders = null;
var order=0;
 //getCurrentUser(); GetOrder();loadBooks();

function GetOrder() {//получение id текущего заказа и его отображение
    try {
        GetRole();
        if (Role === "user") {
            getIdUser();
            var request2 = new XMLHttpRequest();
            request2.open("GET", uriOrders, false);
            orders = null;
            request2.onload = function () {
                if (request2.status === 200) { //если мы получили список заказов
                    orders = JSON.parse(request2.responseText);

                    for (j in orders) {//в цикле ищем заказ пользователя, который является активным
                        if (orders[j].active === 1) {
                            order = orders[j].id;
                        }
                    }          //если список заказов получить не удалось
                } else if (request2.status !== 204) {
                    alert("Возникла неизвестная ошибка! Попробуйте повторить позже! Статус ошибки: " + request2.status);
                }
            };
            request2.send();
        } else if (Role === "admin") {
            var x = "<a class=\"btn btn-dark\" role=\"button\" href=\"admin-panel.html\">Добавить</a>";
            document.getElementById("adminDiv").innerHTML = x;//выводим в документ код html    
        } else {
          //  alert("Пожалуйста, зарегистрируйтесь, чтобы совершать заказы!");
        }

      //  document.getElementById("login-user").innerHTML=y;//выводим в документ код html    
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}
var myObj = "";

function getIdUser() {
    try {
        let request = new XMLHttpRequest();
        request.open("GET", "/api/Account/WhoisAuthenticated", true);
        request.onload = function () {
            if (request.status === 200) {
                myObj = JSON.parse(request.responseText);
            }
        };
        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}


////function CreateFirstOrder() {
////    try {
////        GetRole();
////        if (Role === "user") {
////            if (order === 0) {
////                var request1 = new XMLHttpRequest();
////                request1.open("POST", "/api/Orders/", false);
////                request1.setRequestHeader("Accepts",
////                    "application/json;charset=UTF-8");
////                request1.setRequestHeader("Content-Type",
////                    "application/json;charset=UTF-8");
////                request1.onload = function () {


////                    GetOrder();

////                };
////                request1.send(JSON.stringify({

////                    dateDelivery: "0001-01-01",
////                    dateOrder: "0001-01-01",
////                    sumDelivery: 50,
////                    sumOrder: 0,
////                    active: 1,
////                    userId: "1"
////                }));
////            } else alert("У вас уже существует активный заказ! Прежде чем создавать новый вам надо заказать текущий на вкладке Корзина!");
////        } else alert("У вас не хватает прав!");

      
////    }
////    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
////}

var Role="";
function GetRole() {
    var request = new XMLHttpRequest();
    request.open("GET", "api/Account/GetRole", false);
    request.onload = function () {
        Role = JSON.parse(request.responseText);
    }
    request.send();
}



async function displayBooks(items) {
    var i, x = "";
    var k = 0;//счетчик количество книг в строке
    x += "<div class=\"row\">";//начинаем строку
    for (i in items) {
        if (k == 3) { //если мы заполнили строку -- по 3 книги в строке
            x += "</div>";
            x += "<hr>";
            x += "<div class=\"row\">";
            k = 0;
        }//отображение информации о книге
        x += "<div class=\"col - sm\">";
        x += "<img src=\"" + items[i].image + "\" width=\"150\" height=\"215\" alt=\"" + items[i].title + "\">";
        x += "<h5>" + items[i].title + "</h5>";
        x += "<h6> Год: " + items[i].year + "</h6>";
        x += "<h6> Автор: " + items[i].authors + "</h6>";
        x += "<h6> Издательство: " + items[i].publisher + "</h6>";
        x += "<h5> Цена: " + items[i].cost + "</h5>";
        if (Role === "user") {
            x += "<button onclick=\"add(" + items[i].id + "," + items[i].cost + ");\" class=\"btn btn-dark\"> Купить </button> <br/>";
        }
        if (Role === "admin") {
            x += "<button onclick=\"editBook(" + items[i].id + ");\" class=\"btn btn-dark\"> Редактировать </button>";
            x += "<button onclick=\"deleteBook(" + items[i].id + ");\" class=\"btn btn-dark\"> Удалить </button>";
        }
        x += "</div >";
        k = k + 1;
    }
    while (k !== 3) { //если в последней строке оказалось меньше книг, чем 3
        //создаем пустую колонку
        x += "<div class=\"col - sm\">";
        x += "</div>";
        k = k + 1;
    }
    x += "</div>";
    document.getElementById("ContainerDiv").innerHTML += x;//выводим в документ код html    
}

function loadBooks() { //загрузка книг
    try {
     
        var request = new XMLHttpRequest();
        request.open("GET", uriView, false);
        request.onload = function () {
            items = JSON.parse(request.responseText);
            document.getElementById("ContainerDiv").innerHTML = "";
            displayBooks(items);
            loadBasket();
        };
        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

function loadBasket() { //загружаем корзину, в которой отображается количество книг и сумма текущего заказа
    try {
        var x = "<div class=\"jumbotron p-4 p-md-5 text-white rounded bg-dark\">" +
          "  <a class=\"h3 display-5 text-white align-items-center\" href=\"Basket.html\">Корзина</a>" +
           " <div class=\"msgClass\">"+
              "  <div id=\"msgAuth\"></div>"+
                "<div id=\"msg\"></div>"+
                "<ul id=\"formError\"></ul>";
        if (order) { //если текущий заказ определен
            var request2 = new XMLHttpRequest();
            var url = uriOrders + order;
            request2.open("GET", url, false);//получение данных текущего заказа
            var orderCurrent;
            request2.onload = function () {
                if (request2.status === 200) {
                    orderCurrent = JSON.parse(request2.responseText);
                    x += "<label class=\"lead text - small\"> Книг: " + orderCurrent.amount + "</label><br />";
                    x += "<label class=\"lead text-small\"> Сумма: " + orderCurrent.sumOrder + "</label >";
                    x += "</div ></div>";
                    document.getElementById("BasketDiv").innerHTML = x;
                } else {
                    alert("Возникла ошибка, попробуйте обновить.");
                }
            };
            request2.send();
        }
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}
//id -- книги ; sum -- цена книги
function add(id, sum) {
    //добавление к заказу книги
    //добавляем новое поле в промежуточную таблицу
    try {
        var bookOrder = {
        'IdBook': id,
        'IdOrder': order,
        'Amount': 1,
        'Sum':sum
    }
    var request = new XMLHttpRequest();
    request.open("POST", uriBookOrder);
    request.onload = function () {
        // Обработка кода ответа
        if (request.status === 201) {
                    loadBasket();//загрузка корзины для обновления данных о заказе
        } else if (request.status === 401) {
            alert("Пожалуйста, авторизируйтесь");
        } else {
            alert("Неизвестная ошибка");
        }
    };
    request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(bookOrder));//добавление строки заказа
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

function getCurrentUser() {//получение текущего пользователя
    try {
        let request = new XMLHttpRequest();
        request.open("POST", "/api/Account/isAuthenticated", true);
        request.onload = function () {
            let myObj = "";
            myObj = request.responseText !== "" ?
                JSON.parse(request.responseText) : {};
            document.getElementById("msg").innerHTML = myObj.message;
        };
        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

function deleteBook(id){//удаление книги -- метод, доступный только администратору
    try {
        var request = new XMLHttpRequest();
        var url = "/api/Books/" + id;
        request.open("DELETE", url, false);
        request.onload = function () {
            // Обработка кода ответа
            var msg = "";
            if (request.status === 401) {
                msg = "У вас не хватает прав для удаления";
            } else if (request.status === 204) {
                msg = "Запись удалена";
                loadBooks();
            } else {
                msg = "Неизвестная ошибка";
            }
            document.querySelector("#actionMsg").innerHTML = msg;
        };
        request.send();
    }
    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}
function editBook(id) {//редактирование книги -- метод, доступный только администратору
    try {
        window.location.href = "admin-panel.html?&" + id;
    }
    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}