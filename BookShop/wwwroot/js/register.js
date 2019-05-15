const uri = "api/account/Register";
let myObj = "";
var elForm = document.querySelector("#regForm");

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#registerBtn").addEventListener("click", function () {
        if (elForm.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        else {
         var promise = new Promise(function(resolve, reject) {
                                      // Эта функция будет вызвана автоматически

                                      // В ней можно делать любые асинхронные операции,
                                      // А когда они завершатся — нужно вызвать одно из:
                                      // resolve(результат) при успешном выполнении
                                      // reject(ошибка) при ошибке
            logOff();
            Register();
            })

            // promise.then навешивает обработчики на успешный результат или ошибку
            promise
                .then(
                    result => {
                        // первая функция-обработчик - запустится при вызове resolve
                        getCurrentUser();
                        CreateFirstOrder();
                    },
                    error => {
                        // вторая функция - запустится при вызове reject
                        alert("Rejected: " + error); // error - аргумент reject
                    }
                );
            
           
        }
        elForm.classList.add('was-validated')
    });
});//// Обработка клика по кнопке регистрации

function Register() {
   
    // Считывание данных с формы
    myObj = "";
    var fio = document.querySelector("#fio").value;
    var userName = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var address = document.querySelector("#address").value;
    var phoneNumber = document.querySelector("#phone").value;
    var password = document.querySelector("#password").value;
    var passwordConfirm = document.querySelector("#passwordConfirm").value;
    let request = new XMLHttpRequest();

    request.open("POST", uri);//запрос на регистрацию - -создание нового пользователя
    request.setRequestHeader("Accepts",
        "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type",
        "application/json;charset=UTF-8");
    // Обработка ответа
    request.onload = function () {
        ParseResponse(this); //выводим список ошибок или результат регистрации
       };
    // Запрос на сервер
    request.send(JSON.stringify({
        fio:fio,
        email: email,
        userName: userName,
        phoneNumber: phoneNumber,
        address: address,
        password: password,
        passwordConfirm: passwordConfirm
    }));
}

// Разбор ответа
function ParseResponse(e) {
    // Очистка контейнера вывода сообщений
    document.querySelector("#msg").innerHTML = "";
    var formError = document.querySelector("#formError");
    while (formError.firstChild) {
        formError.removeChild(formError.firstChild);
    }
    // Обработка ответа от сервера
    let response = JSON.parse(e.responseText);
    document.querySelector("#msg").innerHTML = response.message;
    alert(response.message);
    // Вывод сообщений об ошибках
    if (response.error.length > 0) {
        for (var i = 0; i < response.error.length; i++) {
            let ul = document.querySelector("ul");
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(response.error[i]));
            ul.appendChild(li);
        }
    }

    
    // Очистка полей паролей
    document.querySelector("#password").value = "";
    document.querySelector("#passwordConfirm").value = "";
}

function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
    };
    request.setRequestHeader("Content-Type",
        "application/json;charset=UTF-8");
    request.send();
}

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/Account/WhoisAuthenticated", true);
    request.onload = function () {
        if (request.status === 200) {
            myObj = JSON.parse(request.responseText);
            ////если удалось получить текущего пользователя, выводим alert и перенаправляем на главную
            alert("Пользователь успешно зарегистрирован!");
          //  CreateFirstOrder();
            //создаем для него новый заказ
         
            ////создаем заказ для этого пользователя
            //var request1 = new XMLHttpRequest();
            //request1.open("POST", "/api/Orders/", false);
            //request1.setRequestHeader("Accepts",
            //    "application/json;charset=UTF-8");
            //request1.setRequestHeader("Content-Type",
            //    "application/json;charset=UTF-8");
            //request1.onload = function () {
            //    
            //};
            //request1.send(JSON.stringify({
            //    dateDelivery: "0001-01-01",
            //    dateOrder: "0001-01-01",
            //    sumDelivery: 50,
            //    sumOrder: 0,
            //    active: 1,
            //    userId: "1"
            //}));

        }
    };
    request.send();
}

function CreateFirstOrder() {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/Account/CreateFirstOrder", true);
    request.onload = function () {
        if (request.status === 200) {
            window.location.href = "index.html";
        }
    };
    request.send(myObj);
}


