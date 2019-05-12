/*jshint esversion: 6 */
const uri = "/api/blogs/";
let items = null;

document.addEventListener("DOMContentLoaded", function (event) {
    getBlogs();
    // Обработка кликов по кнопкам
    document.getElementById("loginBtn").addEventListener("click", logIn);
    document.getElementById("logoffBtn").addEventListener("click", logOff);
    getCurrentUser();
});

function getCount(data) {
    const el = document.querySelector("#counter");
    let name = "Количество блогов: ";
    if (data > 0) {
        el.innerText = name + data;
    } else {
        el.innerText = "Блогов еще нет";
    }
}

function getBlogs() {
    let request = new XMLHttpRequest();
    request.open("GET", uri);
    request.onload = function () {
        let blogs = "";
        let blogsHTML = "";
        blogs = JSON.parse(request.responseText);

        if (typeof blogs !== "undefined") {
            getCount(blogs.length);
            if (blogs.length > 0) {
                if (blogs) {
                    var i;
                    for (i in blogs) {
                        blogsHTML += '<div class="blogText"><span>' + blogs[i].blogId + ' : ' + blogs[i].url + ' </span>';
                        blogsHTML += '<button onclick="editBlog(' + blogs[i].blogId + ')">Изменить</button>';
                        blogsHTML += '<button onclick="deleteBlog(' + blogs[i].blogId + ')">Удалить</button></div>';
                        if (typeof blogs[i].post !== "undefined" && blogs[i].post.length > 0) {
                            let j;
                            for (j in blogs[i].post) {
                                blogsHTML += "<p>" + blogs[i].post[j].content + "</p>";
                            }
                        }
                    }
                }
            }
            items = blogs;
            document.querySelector("#blogsDiv").innerHTML = blogsHTML;
        }
    };
    request.send();
}

function createBlog() {
    let urlText = "";
    urlText = document.querySelector("#createDiv").value;
    var request = new XMLHttpRequest();
    request.open("POST", uri);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";
        if (request.status === 401) {
            msg = "У вас не хватает прав для создания";
        } else if (request.status === 201) {
            msg = "Запись добавлена";
            getBlogs();
        } else {
            msg = "Неизвестная ошибка";
        }
        document.querySelector("#actionMsg").innerHTML = msg;
    };
    request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ url: urlText }));
}

function editBlog(id) {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "block";
    if (items) {
        let i;
        for (i in items) {
            if (id === items[i].blogId) {
                document.querySelector("#edit-id").value = items[i].blogId;
                document.querySelector("#edit-url").value = items[i].url;
            }
        }
    }
}

function udateBlog() {
    const blog = {
        blogid: document.querySelector("#edit-id").value,
        url: document.querySelector("#edit-url").value
    };
    var request = new XMLHttpRequest();
    request.open("PUT", uri + blog.blogid);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";
        if (request.status === 401) {
            msg = "У вас не хватает прав для изменения";
        } else if (request.status === 204) {
            msg = "Запись изменена";
            getBlogs();
            closeInput();
        } else {
            msg = "Неизвестная ошибка";
        }
        document.querySelector("#actionMsg").innerHTML = msg;
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(blog));
}

function deleteBlog(id) {
    let request = new XMLHttpRequest();
    request.open("DELETE", uri + id);
    request.onload = function () {
        // Обработка кода ответа
        var msg = "";
        if (request.status === 401) {
            msg = "У вас не хватает прав для удаления";
        } else if (request.status === 204) {
            msg = "Запись удалена";
            getBlogs();
        } else {
            msg = "Неизвестная ошибка";
        }
        document.querySelector("#actionMsg").innerHTML = msg;        
    };
    request.send();
}

function closeInput() {
    let elm = document.querySelector("#editDiv");
    elm.style.display = "none";
}

function logIn() {
    var email, password = "";
    // Считывание данных с формы
    email = document.getElementById("Email").value;
    password = document.getElementById("Password").value;
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
            if (typeof msg.error !== "undefined" && msg.error.length > 0) {
                for (var i = 0; i < msg.error.length; i++) {
                    var ul = document.getElementsByTagName("ul");
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(msg.error[i]));
                    ul[0].appendChild(li);
                }
            }
            document.getElementById("Password").value = "";
        }
    };
    // Запрос на сервер
    request.send(JSON.stringify({
        email: email,
        password: password
    }));
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
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
}

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated", true);
    request.onload = function () {
        let myObj = "";
        myObj = request.responseText !== "" ? JSON.parse(request.responseText) : {};
        document.getElementById("msg").innerHTML = myObj.message;
    };
    request.send();
}
