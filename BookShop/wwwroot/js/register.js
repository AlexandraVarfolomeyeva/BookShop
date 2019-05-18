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
             logOff();
             Register();         
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
    getCurrentUser();
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
          //  alert("Пользователь успешно зарегистрирован!");
            window.location.href = "index.html";

        }
    };
    request.send();
}




