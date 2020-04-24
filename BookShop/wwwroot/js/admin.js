!function (e) { "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) { for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;)++n; return Boolean(o[n]) }), "function" != typeof e.closest && (e.closest = function (e) { for (var t = this; t && 1 === t.nodeType;) { if (t.matches(e)) return t; t = t.parentNode } return null }) }(window.Element.prototype);


const uriBooks = "api/Books/";
const uriAuthors = "api/Authors/";
const uriPublishers = "api/Publisher/";
const uriGenres = "api/Genre/";

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

    var modalButtons = document.querySelectorAll('.js-open-modal'),
        overlay = document.querySelector('#overlay-modal'),
        closeButtons = document.querySelectorAll('.js-modal-close');

    overlay.addEventListener('click', function () {
        document.querySelector('.modal1.active').classList.remove('active');
        this.classList.remove('active');
    });

    modalButtons.forEach(function (item) {

        item.addEventListener('click', function (e) {
            e.preventDefault();
            var modalId = this.getAttribute('data-modal'),
                modalElem = document.querySelector('.modal1[data-modal="' + modalId + '"]');

            modalElem.classList.add('active');
            overlay.classList.add('active');
        }); // end click
    }); // end foreach

    closeButtons.forEach(function (item) {

        item.addEventListener('click', function (e) {
            var parentModal = this.closest('.modal1');

            parentModal.classList.remove('active');
            overlay.classList.remove('active');
        });

    }); // end foreach  
});

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

function downloadGenres() {
    let request = new XMLHttpRequest();
    request.open("GET", uriGenres, true);
    request.onload = function () {
        if (request.status === 200) {
            var genres = JSON.parse(request.responseText);
            for (i in genres) {
                var newOption = new Option(genres[i].name, genres[i].id);
                addForm.GenreSelect.options[addForm.GenreSelect.options.length] = newOption;
            }
        }
    };
    request.send();
}

function createAuthor() {
    try {
        var AuthorName = document.querySelector("#AuthorName").value;
        var request = new XMLHttpRequest();
        request.open("POST", uriAuthors);
        request.onload = function () {
            // Обработка кода ответа
            if (request.status == 201) {
                document.getElementById("AuthorName").value = "";
                document.querySelector('.modal1.active').classList.remove('active');
                document.querySelector('#overlay-modal').classList.remove('active');
                var author = JSON.parse(request.response);
                var newOption = new Option(author.name, author.id);
                addForm.authorSelect.options[addForm.authorSelect.options.length] = newOption;
            } else {
                alert("Error " + request.status + ": " + request.responseText);
            }
        };
        request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify({
            name: AuthorName
        }));//добавление строки заказа
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}

function createPublisher(){
    try {
    var PublisherTitle = document.querySelector("#PublisherTitle").value;
    var request = new XMLHttpRequest();
        request.open("POST", uriPublishers);
    request.onload = function () {
        // Обработка кода ответа
        if (request.status == 201) {
            document.getElementById("PublisherTitle").value = "";
            document.querySelector('.modal1.active').classList.remove('active');
            document.querySelector('#overlay-modal').classList.remove('active');
            var publisher = JSON.parse(request.response);
            var newOption = new Option(publisher.name, publisher.id);
            addForm.publisherSelect.options[addForm.publisherSelect.options.length] = newOption;
        } else {
            alert("Error " + request.status+": " + request.responseText);
        }
    };
    request.setRequestHeader("Accepts", "application/json;charset=UTF-8");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({
        name: PublisherTitle
    }));//добавление строки заказа
} catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
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
        var genreSelect = document.querySelector("#GenreSelect").value; ///authorSelect
        var content = document.querySelector("#content").value;
        var year = document.querySelector("#year").value;
        var publisherSelect = document.querySelector("#publisherSelect").value; ///publisherSelect
        var cost = document.querySelector("#cost").value;
        var stored = document.querySelector("#Stored").value;
        var x = document.getElementById("inputImg");

        if (x.files.length == 0) {
            var inputImg = "../img/empty.png";
        }
        else {
            var inputImg = "../img/" + x.files[0].name;
        }
        author = [authorSelect];
        genre = [genreSelect];
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
            stored: stored,
            content: content,
            title: title,
            publisher: publisherSelect,
            authors: author,
            genres:genre
        }));//добавление строки заказа
    } catch (e) { alert("Возникла непредвиденая ошибка! Попробуйте позже!"); }
}