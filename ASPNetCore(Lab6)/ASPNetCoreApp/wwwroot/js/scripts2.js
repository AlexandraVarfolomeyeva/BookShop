/*jshint esversion: 6 */
const uri = "/api/blogs/";
let items = null;

function loadBlogs() {
    var i, j, x = "";
    var request = new XMLHttpRequest();
    request.open("GET", uri, false);    
    request.onload = function () {
        items = JSON.parse(request.responseText);
        for (i in items) {
            x += "<hr>";
            x += "<h4> Блог номер " + items[i].blogId + " : <a href='" + items[i].url + "'>" + items[i].url + "</a></h4>";
            x += "<button type='button' class='btn btn-sm btn-outline-secondary' onclick='deleteBlog(" + items[i].blogId + ");'>Удалить</button>";

            for (j in items[i].post) {
                x += "<div class='col-10'>";
                x += "<h4>" + items[i].post[j].title + "</h4>";
                x += "<p>December 23, 2017 by <a href='#'>Ivan</a></p>";
                x += "<p>" + items[i].post[j].content + "</p><br>";
                x += "</div>";
            }
        }
        document.getElementById("blogsDiv").innerHTML = x;
    };
    request.send();    
}

function deleteBlog(id) {
    var request = new XMLHttpRequest();
    var url = uri + id;
    request.open("DELETE", url, false);
    request.onload = function () {
        loadBlogs();
    };
    request.send();
}

function createBlog() {
    var urlText = document.getElementById("createDiv").value;
    var request = new XMLHttpRequest();
    request.open("POST", uri);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
        loadBlogs();
    };
    request.send(JSON.stringify({ url: urlText }));
}