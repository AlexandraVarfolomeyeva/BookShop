document.querySelector("#logoffBtn").addEventListener("click",
    logOff);
document.addEventListener("DOMContentLoaded", function () {
    getUserInfo();
});

function logOff() {
    try {
        var request = new XMLHttpRequest();
        request.open("POST", "api/account/logoff");
        request.onload = function () {
            if (this.status == 200) {
                window.location.href = "index.html";
            }
        };
        request.setRequestHeader("Content-Type",
            "application/json;charset=UTF-8");
        request.send();
    }
    catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

var user;
function getUserInfo() {
    try {
        var request = new XMLHttpRequest();
        request.open("GET", "api/Account/CurrentUserInfo");
        request.onload = function () {
            if (request.status === 200) {
                user = JSON.parse(request.responseText);
                document.getElementById('fio').value = user.fio;
                document.getElementById('name').value = user.userName;
                document.getElementById('email').value = user.email;
                document.getElementById('address').value = user.address;
                document.getElementById('phone').value = user.phoneNumber;
                document.getElementById('OldPassword').value = "";

            }
        };
        request.send();
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}