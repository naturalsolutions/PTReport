var token;
var projectId;
var date;

function getAllProjects() {
    console.log("getAllProjects" + token);
    var url = "https://www.pivotaltracker.com/services/v5/projects"
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
    }).done(function (projects) {
        $(projects).each(function (index, project) {
            $("#sctProjects").append(new Option(project.name, project.id));
        });
    });
}

function getStoryWDate() {
    console.log("getStoryWDate");
    // récupération des parametres
    projectId = $('#sctProjects').val();


    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + projectId;
    url += '/stories?filter=';
    url += ' includedone:true';
    if ($("#restrUser").is(':checked')) {
        url += ' owned_by:' + $("#sctUserRestrict").val();
    }
    if ($("#restrState").is(':checked')) {
        url += ' state:' + $("#sctState").val();
    } else {
        url += ' accepted_after:' + date;
    }
    if ($("#restrLabel").is(':checked')) {
        url += ' label:' + $("#sctLabel").val();
    }
    // do API request to get story names
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
        //on affiche les stories et on récupère les taches
    }).done(displayStories, getTasks);
}

function getTasks(stories) {
    console.log("getTasks");
    $(stories).each(function (index, story) {
        //création de l'url qui va récupérer les tache de la story
        var url = 'https://www.pivotaltracker.com/services/v5';
        url += '/projects/' + projectId;
        url += '/stories/' + story.id;
        url += '/tasks';
        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-TrackerToken', token);
            }
        }).done(displayTasks);
    });
}

function fillInformation(projectId) {
    var url = "https://www.pivotaltracker.com/services/v5/projects/"
    $.ajax({
        url: url + projectId + "/memberships",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
    }).done(function (users) {
        $("#sctUserRestrict").children().remove();
        $(users).each(function (index, user) {
            $("#sctUserRestrict").append(new Option(user.person.initials, user.person.name));
        });
    });
    $.ajax({
        url: url + projectId + "/labels",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
    }).done(function (labels) {
        $("#sctLabel").children().remove();
        $(labels).each(function (index, label) {
            $("#sctLabel").append(new Option(label.name, label.name));
        });
    });
}

function run() {
    console.log("kaka " +$("#restrState").val());
    if ($("#restUser").is(':checked')) {
        if ($("#sctUserRestrict").val() == "") {
            alert("Please choose the user to be restict");
            return;
        }
    }
    if ($("#restrState").is(':checked')) {
        if ($("#sctState").val() == "") {
            alert("Please choose the state to be restict");
            return;
        }
    }
    if ($("#restrLabel").is(':checked')) {
        if ($("#sctLabel").val() == "") {
            alert("Please choose the label to be restict");
            return;
        }
    }
    getStoryWDate();
}