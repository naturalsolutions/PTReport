function displayTasks(tasks) {
    console.log("displayTasks");
    $(tasks).each(function (index, task) {
        tasksTab.push(task);
        var strHTML = "";
        strHTML = "<li>" + task.description + "</li>";
        $("ul[id=" + task.story_id + "]").append(strHTML);
    });
    console.log(tasksTab);
}

function displayStories(stories) {
    console.log("displayStories");
    var html = '';
    html += '<div class="row">';
    html += '<div class="span10 offset1">';
    html += '<h1>Stories preview -> ' + $(stories).length + ' </h1>';
    html += '</div>';
    html += '</div>';
    for (var i = 0; i < stories.length; i++) {
        storiesTab.push(stories[i]);
        //html += '<li id="' + stories[i].id + '">' + stories[i].name + '</li>';
        html += '<div class="row">';
        html += '<div class="span10 offset1" id="storiesDiv">';
        html += '<ul><li><h4>' + stories[i].name + '</h4></li>';
        html += '<ul id="' + stories[i].id + '"></ul>';
        html += '</ul></div>';
        html += '</div>';
    }
    $('#resultDiv').html(html);
    console.log(storiesTab);
}