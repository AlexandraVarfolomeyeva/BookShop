// Обработка клика по кнопке регистрации
document.querySelector("#loginBtn").addEventListener("click", 
    logIn);
document.querySelector("#logoffBtn").addEventListener("click",
    logOff);

function logIn() {
    var user, password = "";
    var remember;
    // Считывание данных с формы
    user = document.getElementById("User").value;
    password = document.getElementById("Password").value;
    remember = document.getElementById("Remember").checked;
    var request = new XMLHttpRequest();
    request.open("POST", "/api/Account/Login");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        // Очистка контейнера вывода сообщений
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        // Обработка ответа от сервера
        if (request.responseText !== "") {
            var msg = null;
            msg = JSON.parse(request.responseText);
            document.getElementById("msg").innerHTML = msg.message;
            // Вывод сообщений об ошибках
            if (typeof msg.error !== "undefined" && msg.error.length >
                0) {
                for (var i = 0; i < msg.error.length; i++) {
                    var ul = document.getElementsByTagName("ul");
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(msg.error[i]));
                    ul[0].appendChild(li);
                }
            }
            document.getElementById("Password").value = "";
        }
        getUser();
    };
    // Запрос на сервер
    request.send(JSON.stringify({
        user: user,
        password: password,
        rememberMe: remember
    }));
    // вывести результат
}
function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
        var msg = JSON.parse(this.responseText);
        document.getElementById("msg").innerHTML = "";
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        document.getElementById("msg").innerHTML = msg.message;
       
    };
    request.setRequestHeader("Content-Type",
        "application/json;charset=UTF-8");
    request.send();
}

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

function getUser() {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/Account/WhoisAuthenticated", true);
    request.onload = function () {
        if (request.status === 200) {
         //   alert("Вы успешно вошли!");
            window.location.href = "index.html";
        }
    };
    request.send();
}