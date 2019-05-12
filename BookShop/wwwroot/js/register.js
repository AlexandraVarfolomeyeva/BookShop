const uri = "api/account/Register";


    ////    Register);, false
    //window.addEventListener('load',
document.querySelector("#registerBtn").addEventListener("click",
 function () {
         //Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation')
         //Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                
                form.classList.add('was-validated')
            }, false)
           
     })
     Register()
    })

function Register() {
    // Считывание данных с формы
    var fio = document.querySelector("#fio").value;
    var userName = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var address = document.querySelector("#address").value;
    var phoneNumber = document.querySelector("#phone").value;
    var password = document.querySelector("#password").value;
    var passwordConfirm = document.querySelector("#passwordConfirm").value;
    let request = new XMLHttpRequest();
    request.open("POST", uri);
    request.setRequestHeader("Accepts",
        "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type",
        "application/json;charset=UTF-8");
    // Обработка ответа
    request.onload = function () {
       ParseResponse(this);
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
    // Вывод сообщений об ошибках
    if (response.error.length > 0) {
        for (var i = 0; i < response.error.length; i++) {
            let ul = document.querySelector("ul");
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(response.error[i]));
            ul.appendChild(li);
        }
    }
    alert(response.message);
    
  //  window.location.href = "index.html";
    
    // Очистка полей паролей
    document.querySelector("#password").value = "";
    document.querySelector("#passwordConfirm").value = "";
}

//// Обработка клика по кнопке регистрации
//document.querySelector("#registerBtn").addEventListener("click",
//    Register);

