function displayTasks(tasks) {
    console.log("displayTasks", tasks);
    $(tasks).each(function (index, task) {
        tasksTab.push(task);
        var strHTML = "";
        strHTML = "<li>" + task.description + "</li>";
        $("ul[id=" + task.story_id + "]").append(strHTML);
    });
    console.log(tasksTab);
}

function displayStories(stories, optProjectId) {
    console.log("displayStories", stories);
    var theId;
    if (optProjectId != null && optProjectId !== 'undefined') {
        theId = optProjectId;
    } else {
        theId = projectId;
    }
    console.log('desinfos', theId, allProjects)
    var html = '';
    html += '<div id="projectId_' + theId+'">'
    html += '<div class="row">';
    html += '<div class="span10 offset1">';
    html += '<h2>Project ID -> ' + allProjects.find(x => x.id == theId).name + ' </h2>';
    html += '<h2>Stories preview -> ' + $(stories).length + ' </h2>';
    html += '</div>';
    html += '</div>';
    for (var i = 0; i < stories.length; i++) {
        //html += '<li id="' + stories[i].id + '">' + stories[i].name + '</li>';
        html += '<div class="row">';
        html += '<div class="span10 offset1" id="storiesDiv">';
        html += '<ul><li><h4>' + stories[i].name + '</h4></li>';
        html += '<ul id="' + stories[i].id + '"></ul>';
        html += '</ul></div>';
        html += '</div>';
    }
    html += '</div>'; 
    storiesTab = stories;
    $('#resultDiv').append(html);
    console.log('storiesTab', stories);
    getTasks(stories, optProjectId);    
}

function displayOneStory(story, optProjectId) {
    console.log('lesarguments', arguments)
    var theId;
    if (optProjectId != null && optProjectId !== 'undefined') {
        theId = optProjectId;
    } else {
        theId = projectId;
    }
    var projectContainer = $('#projectId_' + theId);
    if (projectContainer != null && projectContainer !== undefined) {
        var html = '';
    
        html += '<div class="row">';
        html += '<div class="span10 offset1" id="storiesDiv">';
        html += '<ul><li><h4>' + story.name + '</h4></li>';
        html += '<ul id="' + story.id + '"></ul>';
        html += '</ul></div>';
        html += '</div>';
        
        projectContainer.append(html);
        //storiesTab = stories;        
    }
}