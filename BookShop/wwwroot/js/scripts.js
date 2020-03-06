const uri = "/api/Books/";
const uri1 = "/api/BookOrder/";
const uri2 = "/api/Orders/";
let items = null;
let books = null;
let orders = null;
var order=0;
 //getCurrentUser(); GetOrder();loadBooks();

function GetOrder() {//получение id текущего заказа и его отображение
    try {
        GetRole();
        getIdUser();
        if (Role === "user") {
            var request2 = new XMLHttpRequest();
            request2.open("GET", uri2, false);
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
        }
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


function CreateFirstOrder() {
    try {
        GetRole();
        if (Role === "user") {
            if (order === 0) {
                var request1 = new XMLHttpRequest();
                request1.open("POST", "/api/Orders/", false);
                request1.setRequestHeader("Accepts",
                    "application/json;charset=UTF-8");
                request1.setRequestHeader("Content-Type",
                    "application/json;charset=UTF-8");
                request1.onload = function () {


                    GetOrder();

                };
                request1.send(JSON.stringify({

                    dateDelivery: "0001-01-01",
                    dateOrder: "0001-01-01",
                    sumDelivery: 50,
                    sumOrder: 0,
                    active: 1,
                    userId: "1"
                }));
            } else alert("У вас уже существует активный заказ! Прежде чем создавать новый вам надо заказать текущий на вкладке Корзина!");
        } else alert("У вас не хватает прав!");
    }
    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

var Role="";
function GetRole() {
    var request = new XMLHttpRequest();
    request.open("GET", "api/Account/GetRole", false);
    request.onload = function () {
        Role = JSON.parse(request.responseText);
    }
    request.send();
}

function loadBooks() { //загрузка книг
    try {
        var i, x = "";
        var k = 0;//счетчик количество книг в строке
        var request = new XMLHttpRequest();
        request.open("GET", uri, false);
        request.onload = function () {
            items = JSON.parse(request.responseText);
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
                x += "<h6> Id: " + items[i].id + "</h6>";
                x += "<h6> Год: " + items[i].year + "</h6>";
                x += "<h6> Автор: " + items[i].author + "</h6>";
                x += "<h6> Издательство: " + items[i].publisher + "</h6>";
                x += "<h5> Цена: " + items[i].cost + "</h5>";
                x += "<button onclick=\"add(" + items[i].id + "," + items[i].cost + ");\" class=\"btn btn-dark\"> Купить </button> <br/>";
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
            document.getElementById("ContainerDiv").innerHTML = x;//выводим в документ код html    
            loadBasket();
        };

        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

function loadBasket() { //загружаем корзину, в которой отображается количество книг и сумма текущего заказа
    try {
        var i, x = "<div class=\"jumbotron p-4 p-md-5 text-white rounded bg-dark\">" +
          "  <a class=\"h3 display-5 text-white align-items-center\" href=\"Basket.html\">Корзина</a>" +
           " <div class=\"msgClass\">"+
              "  <div id=\"msgAuth\"></div>"+
                "<div id=\"msg\"></div>"+
                "<ul id=\"formError\"></ul>";
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
function editBook(id) {//удаление книги -- метод, доступный только администратору
    try {
        //вывести модальное окно, где записи будут редактироваться
        //по нажатию кнопки сохр. отпр. запрос.
        alert('edit ' + id);
        //var request = new XMLHttpRequest();
        //var url = "/api/Books/" + id;
        //request.open("PUT", url, false);
        //request.onload = function () {
        //    // Обработка кода ответа
        //    var msg = "";
        //    //   alert(request.status);
        //    if (request.status === 401) {
        //        msg = "У вас не хватает прав для удаления";
        //    } else if (request.status === 204) {
        //        msg = "Запись удалена";
        //        loadBooks();
        //    } else {
        //        msg = "Неизвестная ошибка";
        //    }
        //    document.querySelector("#actionMsg").innerHTML = msg;
        //};
        //request.send();
    }
    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}