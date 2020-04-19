const uriBooks = "api/Books/";
const uriAuthors = "api/Authors/";
const uriPublishers = "api/Publisher/";

var elForm = document.querySelector("#addForm");

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#addBtn").addEventListener("click", function () {
        if (elForm.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        else {
            logOff();
            Register();
        }
        elForm.classList.add('was-validated')
    });
});//// Обработка клика по кнопке регистрации

function downloadAuthors() {
    let request = new XMLHttpRequest();
    request.open("GET", uriAuthors, true);
    request.onload = function () {
        if (request.status === 200) {
            var authors = JSON.parse(request.responseText);
            for (i in authors) {
                var newOption = new Option(authors[i].name, authors[i].id);
                addForm.authorSelect.options[addForm.authorSelect.options.length] = newOption;
            }
        }
    };
    request.send();
}

$("#inputImg").change(function () {
    var filename = this.files[0].name
    console.log(filename);
});

function downloadPublishers() {
    let request = new XMLHttpRequest();
    request.open("GET", uriPublishers, true);
    request.onload = function () {
        if (request.status === 200) {
            var publishers = JSON.parse(request.responseText);
            for (i in publishers) {
                var newOption = new Option(publishers[i].name, publishers[i].id);
                addForm.publisherSelect.options[addForm.publisherSelect.options.length] = newOption;
            }
        }
    };
    request.send();
}

function addBook() {
    //добавление к заказу книги
    //добавляем новое поле в промежуточную таблицу
    try {
        var title = document.querySelector("#title").value;
        var authorSelect = document.querySelector("#authorSelect").value; ///authorSelect
        var content = document.querySelector("#content").value;
        var year = document.querySelector("#year").value;
        var publisherSelect = document.querySelector("#publisherSelect").value; ///publisherSelect
        var cost = document.querySelector("#cost").value;
        var store = document.querySelector("#store").value;
        var inputImg = document.querySelector("#inputImg").value;
        var request = new XMLHttpRequest();
        request.open("POST", uriBooks);
        request.onload = function () {
            // Обработка кода ответа
            var msg = "";//сообщение
            if (request.status === 200) {
                msg = "Не добавлено";
            } else if (request.status === 201) {
                msg = "Запись добавлена";
                uriOrder = uriOrders + order;//получение текущего заказа
                var request1 = new XMLHttpRequest();
                request1.open("GET", uriOrder, false);
                var item;///Получение данных о заказе + сумму новой книги
                request1.onload = function () {
                    item = JSON.parse(request1.responseText);
                    item.sumOrder += sum;//к сумме текущего заказа прибавляется стоимость книги
                    ///Изменение данных о заказе -- отправка изменений в БД
                    var request2 = new XMLHttpRequest();
                    request2.open("PUT", uriOrder);
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
        request.send(JSON.stringify(book));//добавление строки заказа
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}