
const uri2 = "/api/Orders/";
let items = null;
let books = null;
let orders = null;
var order;
//getCurrentUser(); GetOrder();loadBooks();
document.addEventListener("DOMContentLoaded", function (event) {
    load.getCurrentUser();
    gets.GetOrder();
    load.loadBooks();
    load.loadBasket(); });


var gets =  {
    Role : "",
    order, //id текущего заказа
    orders, //список всех заказов пользователя
    uriRole : "api/Account/GetRole",
    uriOrders : "/api/Orders/",//контроллер заказов пользователя
    uriBooks : "/api/Books/",
    uriBO : "/api/BookOrder/",

    request_get : function (url) {
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.onload = function () {
            return JSON.parse(request.responseText);
        };
        request.send();
    },

    getRole : function () {
        var request = new XMLHttpRequest();
        request.open("GET", gets.uriRole, false);
        request.onload = function () {
            gets.Role = JSON.parse(request.responseText);
        }
        request.send(); 
    },

    GetOrder : function () {
        try {
            gets.getRole();
            if (gets.Role === "user") {
                var request2 = new XMLHttpRequest();
                request2.open("GET", gets.uriOrders, false);
                gets.orders = null;
                request2.onload = function () {
                    if (request2.status === 200) { //если мы получили список заказов
                        gets.orders = JSON.parse(request2.responseText);

                        for (j in gets.orders) {//в цикле ищем заказ пользователя, который является активным
                            if (gets.orders[j].active === 1) {
                                gets.order = gets.orders[j].id;
                            }
                        }          //если список заказов получить не удалось
                    } else if (request2.status !== 204) {
                        alert("Возникла неизвестная ошибка! Попробуйте повторить позже! Статус ошибки: " + request2.status);
                    }
                };
                request2.send();
            }
        } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
    }
};

var load = {
   
    x : "",
    k:0, //счетчик количество книг в строке
    loadBooks : function () {//загрузка книг
        x = "";
        k = 0;
        var request = new XMLHttpRequest();
        request.open("GET", gets.uriBooks, false);
        request.onload = function () {
        books = JSON.parse(request.responseText);
        x += "<div class=\"row\">";//начинаем строку
        for (i in books) {
            if (k == 3) { //если мы заполнили строку -- по 3 книги в строке
                x += "</div>";
                x += "<hr>";
                x += "<div class=\"row\">";
                k = 0;
            }//отображение информации о книге
            x += "<div class=\"col - sm\">";
            x += "<img src=\"" + books[i].image + "\" width=\"150\" height=\"215\" alt=\"" + books[i].title + "\">";
            x += "<h5>" + books[i].title + "</h5>";
            x += "<h6> Id: " + books[i].id + "</h6>";
            x += "<h6> Год: " + books[i].year + "</h6>";
            x += "<h6> Автор: " + books[i].author + "</h6>";
            x += "<h6> Издательство: " + books[i].publisher + "</h6>";
            x += "<h5> Цена: " + books[i].cost + "</h5>";
            x += "<button onclick=\"load.add(" + books[i].id + "," + books[i].cost + ");\" class=\"btn btn-dark\"> Купить </button> <br/>";
            if (gets.Role === "admin") {
                x += "<button onclick=\"deleteBook(" + books[i].id + ");\" class=\"btn btn-dark\"> Удалить </button>";
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
        document.getElementById("ContainerDiv").innerHTML = x;//выводим в документ код html    
        //    load.loadBasket();
        };

        request.send();
    },

    loadBasket : function () {
      var  k = 0;
       var x = "";
        var i;
        var items = null;
        if (gets.order) {
            var request = new XMLHttpRequest();
            request.open("GET", gets.uriBO, false); //получение строк заказа
            request.onload = function () {
                if (request.status === 200) {
                    items = JSON.parse(request.responseText);
                    x += "<br />";
                    for (i in items) {
                        if (items[i].idOrder === gets.order) {
                            k += 1; //считаем количество записей в текущем заказе
                        }
                    }

                    x += "<label class=\"lead text - small\"> Книг: " + k + "</label><br />";
                    //document.getElementById("BasketDiv").innerHTML = x;
                } else {
                    alert("Возникла ошибка, попробуйте обновить.");
                }
            };
            request.send();
            var request2 = new XMLHttpRequest();
            var url = gets.uriOrders + gets.order;
            request2.open("GET", url, false);//получение данных текущего заказа
            var orderCurrent;
            request2.onload = function () {
                if (request2.status === 200) {
                    orderCurrent = JSON.parse(request2.responseText);
                    x += "<label class=\"lead text-small\"> Сумма: " + orderCurrent.sumOrder + "</label >";
                    document.getElementById("BasketDiv").innerHTML = x;
                } else {
                    alert("Возникла ошибка, попробуйте обновить.");
                }
            };
            request2.send();
        }
    },

//id -- книги ; sum -- цена книги
    add: function (id, sum) {
        //добавление к заказу книги
        //добавляем новое поле в промежуточную таблицу
        var bookOrder = {
            'IdBook': id,
            'IdOrder': gets.order
        }
        var request = new XMLHttpRequest();
        request.open("POST", gets.uriBO);
        request.onload = function () {
            // Обработка кода ответа
            var msg = "";//сообщение
            if (request.status === 200) {
                msg = "Не добавлено";
            } else if (request.status === 201) {
                msg = "Запись добавлена";
                uri3 = gets.uriOrders + gets.order;//получение текущего заказа
                var request1 = new XMLHttpRequest();
                request1.open("GET", uri3, false);
                var item;///Получение данных о заказе + сумму новой книги
                request1.onload = function () {
                    item = JSON.parse(request1.responseText);
                    item.sumOrder += sum;//к сумме текущего заказа прибавляется стоимость книги
                    ///Изменение данных о заказе -- отправка изменений в БД
                    var request2 = new XMLHttpRequest();
                    request2.open("PUT", uri3);
                    request2.onload = function () {
                        load.loadBasket();//загрузка корзины для обновления данных о заказе
                    };
                    request2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    request2.send(JSON.stringify(item));
                };
                request1.send();

            } else if (request.status === 404) {
                msg = "Пожалуйста, авторизируйтесь"
            } else {
                msg = "Неизвестная ошибка";
            }
            document.querySelector("#actionMsg").innerHTML = msg;//вывод сообщения
        };
        request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(bookOrder));//добавление строки заказа
    },

    getCurrentUser: function () {//получение текущего пользователя
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated", true);
    request.onload = function () {
        let myObj = "";
        myObj = request.responseText !== "" ?
            JSON.parse(request.responseText) : {};
        document.getElementById("msg").innerHTML = myObj.message;
    };
    request.send();
    }
};

function deleteBook(id) {//удаление книги -- метод, доступный только администратору
    var request = new XMLHttpRequest();
    var url = "/api/Books/" + id;
    request.open("DELETE", url, false);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";
        //   alert(request.status);
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