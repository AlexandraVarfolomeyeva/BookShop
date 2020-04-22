
document.addEventListener("DOMContentLoaded", function () {
    getCurrentUser();
});

function getCurrentUser() {//получение текущего пользователя
    try {
        let request = new XMLHttpRequest();
        request.open("POST", "/api/Account/isAuthenticated", true);
        request.onload = function () {
            let myObj = "";
            myObj = request.responseText !== "" ?
                JSON.parse(request.responseText) : {};
            if (myObj.message != "") {
                document.getElementById("logIn").innerHTML = myObj.message;
                document.getElementById("logIn").href = "Account.html";
            }
            else {
                document.getElementById("logIn").innerHTML = "Войти";
                document.getElementById("logIn").href = "LogIn.html";
            }
        };
        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}