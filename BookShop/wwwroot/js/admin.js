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
            addBook();
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

function getImg() {
    var x = document.getElementById("inputImg");
    document.getElementById('labelImg').innerHTML = x.files[0].name;
    document.getElementById('bookImg').src = window.URL.createObjectURL(x.files[0]);
}

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
        var store = true;  //document.querySelector("#store").checked;
        var x = document.getElementById("inputImg");
        if (x.files.length == 0) {
            var inputImg = "../img/empty.png";
        }
        else {

            console.log(x.files);
            var inputImg = "../img/" + x.files[0].name;
        }
        author = [authorSelect];

        var request = new XMLHttpRequest();
        request.open("POST", uriBooks);
        request.onload = function () {
            // Обработка кода ответа
            if (request.status == 201) {
                window.location.href = "index.html";
            } else {
                alert("Error");
            }
        };
        request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify({
            image: inputImg,
            year: year,
            cost: cost,
            store: store,
            content: content,
            title: title,
            publisher: publisherSelect,
            authors: author        
        }));//добавление строки заказа
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}