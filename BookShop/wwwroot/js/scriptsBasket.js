﻿const uri = "/api/Books/";
const uri1 = "/api/BookOrder/";
const uri2 = "/api/Orders/";
var order;
let items = null;
let books = null;
let orders = null;
var x = "";

function GetOrder() {//получение id текущего заказа и его отображение
    var request2 = new XMLHttpRequest();
    request2.open("GET", uri2, false);
    orders = null;x = "";
    request2.onload = function () {
        orders = JSON.parse(request2.responseText);
        for (j in orders) {
            if (orders[j].active == 1) {
                order = orders[j].id;
                x += "<p> Дата доставки: " + orders[j].dateDelivery + "</p>";
                x += "<p> Сумма: " + orders[j].sumOrder + "</p>";
                x += "<p> Стоимость доставки: " + orders[j].sumDelivery + "</p>"; 
            }
        }
        loadBooks();//загружаем книги, входящие в этот заказ
        document.getElementById("BasketDiv").innerHTML = x; //выводим скрипт в элемент BasketDiv
    };
    request2.send();
    loadHistory(); //загрузка истории заказов
}

function loadHistory() {
    var i, y = "";
    var request = new XMLHttpRequest();
    request.open("GET", uri2, false);
    request.onload = function () {
        orders = JSON.parse(request.responseText);
        for (i in orders) {
            if (orders[i].dateOrder) {
                y += "<hr>";
                y += "<p> Дата заказа: " + orders[i].dateOrder + "</p>";
                y += "<p> Дата доставки: " + orders[i].dateDelivery + "</p>";
                y += "<p> Сумма: " + orders[i].sumOrder + "</p>";
                y += "<p> Стоимость доставки: " + orders[i].sumDelivery + "</p>";
            } else { order = orders[i].id;}
        }
    document.getElementById("BasketHistoryDiv").innerHTML = y;
};
request.send();
}

function loadBooks(){//загрузить книги
    var i;
        items = null;
        var request = new XMLHttpRequest();
        request.open("GET", uri1, false);
        request.onload = function () {
            items = JSON.parse(request.responseText);
            for (i in items) {
                if (items[i].idOrder == order) {
                    loadBook(items[i].idBook, items[i].id);
                }
            }
        };
        request.send();
}

function MakeOrder() {//Active=0, создать новый текущий заказ для этого пользователя
    var request = new XMLHttpRequest();
    var url = uri1 + id;
    request.open("GET", url, false);
    request.onload = function () {
        GetOrder();
    };
    request.send();
}

function loadBook(id,idItem) {
    var i;
    books = null;
    var request = new XMLHttpRequest();
    request.open("GET", uri, false);
    request.onload = function () {
        books = JSON.parse(request.responseText);
        for (i in books) {
            if (books[i].id == id) {
                x += "<br /> <br />";
                x += "<img src=\"" + books[i].image + "\" width=\"150\" height=\"215\" alt=\"" + books[i].title + "\">";
                x += "<h5>" + books[i].title + "</h5>";
                x += "<h6> Id: " + books[i].id + "</h6>";
                x += "<h6> Год: " + books[i].year + "</h6>";
                x += "<h5> Цена: " + books[i].cost + "</h5>";
                x += "<button onclick=\"deleteOrder(" + idItem + "," + books[i].cost+ ");\" class=\"btn btn-dark\"> Удалить </button> </div >"; 
            }
        }
    };
    request.send();
}

function deleteOrder(id, cost) { //order.sum-sum of book
    //перерисовать список книг и сумму заказа
    
    var request = new XMLHttpRequest();
    var url = uri1 + id;
    request.open("DELETE", url, false);
    request.onload = function () {
        updateOrder(cost);
        GetOrder();
    };
    request.send();
    GetOrder();
}

function updateOrder(cost) {
    //добавление к заказу книги
    ///Получение данных о заказе + сумму новой книги
    uri3 = uri2 + order;
    var request1 = new XMLHttpRequest();
    request1.open("GET", uri3, false);
    var item;
    request1.onload = function () {
        item = JSON.parse(request1.responseText);
        item.sumOrder -= cost;
        if (item.sumOrder < 0) item.sumOrder = 0;
   ///Изменение данных о заказе
                var request2 = new XMLHttpRequest();
                request2.open("PUT", uri3);
                request2.onload = function () {
                };
                request2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                request2.send(JSON.stringify(item));
                GetOrder();
 
    };
    GetOrder();
    request1.send();
}
//==================

function getCurrentUser() {
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