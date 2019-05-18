
const uri2 = "/api/Orders/";
let items = null;
let books = null;
let orders = null;
var order;
//getCurrentUser(); GetOrder();loadBooks();

var program =  {
   
  //  gets.getCurrentUser();
    gets.GetOrder(),
    load.loadBooks(),
    load.loadBasket(),
};

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
        Role =  request_get(uriRole);
    },

    GetOrder : function () {
        torders = request_get(uriOrders);
        for (j in orders) {//в цикле ищем заказ пользователя, который является активным
            if (orders[j].active === 1) {
                order = orders[j].id;
            }
        }
    }
};

var load = new function () {
    this.i;
    this.x = "";
    this.k=0;//счетчик количество книг в строке
    this.loadBooks = new function () {//загрузка книг
        this.x = "";
        this.k = 0;
        gets.Role();
        this.books = gets.request_get(gets.uriBooks);
        x += "<div class=\"row\">";//начинаем строку
        for (i in this.books) {
            if (this.k == 3) { //если мы заполнили строку -- по 3 книги в строке
                this.x += "</div>";
                this.x += "<hr>";
                this.x += "<div class=\"row\">";
                this.k = 0;
            }//отображение информации о книге
            this.x += "<div class=\"col - sm\">";
            this.x += "<img src=\"" + this.books[i].image + "\" width=\"150\" height=\"215\" alt=\"" + items[i].title + "\">";
            this.x += "<h5>" + this.books[i].title + "</h5>";
            this.x += "<h6> Id: " + this.books[i].id + "</h6>";
            this.x += "<h6> Год: " + this.books[i].year + "</h6>";
            this.x += "<h6> Автор: " + this.books[i].author + "</h6>";
            this.x += "<h6> Издательство: " + this.books[i].publisher + "</h6>";
            this.x += "<h5> Цена: " + this.books[i].cost + "</h5>";
            this.x += "<button onclick=\"add(" + this.books[i].id + "," + this.books[i].cost + ");\" class=\"btn btn-dark\"> Купить </button> <br/>";
            if (gets.Role === "admin") {
                this.x += "<button onclick=\"deleteBook(" + this.books[i].id + ");\" class=\"btn btn-dark\"> Удалить </button>";
            }
            this.x += "</div >";
            this.k = this.k + 1;
        }
        while (this.k !== 3) { //если в последней строке оказалось меньше книг, чем 3
            //создаем пустую колонку
            this.x += "<div class=\"col - sm\">";
            this.x += "</div>";
            this.k = this.k + 1;
        }
        this.x += "</div>";
        document.getElementById("ContainerDiv").innerHTML = this.x;//выводим в документ код html    
        loadBasket();
    };

    this.loadBasket = new function () {
        this.k = 0;
        this.x = "";
        if (gets.order)
            this.items = gets.request_get(gets.uriBO);
        x += "<br />";
        for (this.i in this.items) {
            if (this.items[i].idOrder === gets.order) {
                this.k += 1; //считаем количество записей в текущем заказе
            }
        }
        x += "<label class=\"lead text - small\"> Книг: " + k + "</label><br />";

    };
};

     

function loadBasket() { //загружаем корзину, в которой отображается количество книг и сумма текущего заказа
    var i, x = "";
    items = null;
    var k = 0; //счетчик количества книг в заказе
    if (order) { //если текущий заказ определен
        var request = new XMLHttpRequest();
        request.open("GET", uri1, false); //получение строк заказа
        request.onload = function () {
            if (request.status === 200) {
                items = JSON.parse(request.responseText);
                x += "<br />";
                for (i in items) {
                    if (items[i].idOrder === order) {
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
        var url = uri2 + order;
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
}
//id -- книги ; sum -- цена книги
function add(id, sum) {
    //добавление к заказу книги
    //добавляем новое поле в промежуточную таблицу
    var bookOrder = {
        'IdBook': id,
        'IdOrder': order
    }
    var request = new XMLHttpRequest();
    request.open("POST", uri1);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";//сообщение
        if (request.status === 200) {
            msg = "Не добавлено";
        } else if (request.status === 201) {
            msg = "Запись добавлена";
            uri3 = uri2 + order;//получение текущего заказа
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
                    loadBasket();//загрузка корзины для обновления данных о заказе
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
}

function getCurrentUser() {//получение текущего пользователя
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