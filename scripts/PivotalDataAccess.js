var token;
var projectId;
var date;
var dateEnd;
var allProjects;
var multipleProjects = [];

function createCheckboxEntry(name, id) {
    var htmlCheck = '<label class="CheckLabel"><input type="checkbox" class="CheckBoxLabel" name="'+name+'" id="'+id+'" />' + name + '</label>';    
    return htmlCheck;
}

function getAllProjects() {
    console.log("getAllProjects" + token);
    token = 'b4a752782f711a7c564221c2b0c2d5dc';
    var url = "https://www.pivotaltracker.com/services/v5/projects"
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
    }).done(function (projects) {
        allProjects = projects;
        console.log('allprojects', allProjects);
    });
}

function feedProjectsSelection(type) {
    if (type == 'single') {
        if ($("#sctProjects").find('option').length == 1) {
            $(allProjects).each(function (index, project) {
                $("#sctProjects").append(new Option(project.name, project.id));
            });
        }
    } else {
        if (!$("#sctProjectsMultiple").find('input').length > 0) {
            $(allProjects).each(function (index, project) {
                $("#sctProjectsMultiple").append(createCheckboxEntry(project.name, project.id));
            });
        }
    }    
}

function getStoryWDate(optProjectId) {
    console.log("getStoryWDate");
    // récupération des parametres
    projectId = $('#sctProjects').val();


    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
    url += '/stories?filter=';
    url += ' includedone:true';
    url += ' accepted_after:' + date;
    console.log("l'url", url);
    if ($("#restrUser").is(':checked')) {
        url += ' owned_by:' + $("#sctUserRestrict").val();
    }
    if ($("#restrState").is(':checked')) {
        url += ' state:' + $("#sctState").val();
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
    }).done(function (data) {
        console.log('data', data);        

        if (optProjectId != null && optProjectId !== 'undefined') {
            console.log('dataTransfert', data);
            var projectName = allProjects.find(x => x.id == optProjectId).name
            multipleProjects.push({ 'name': projectName, 'stories': data });
            console.log('multpileprojects', multipleProjects);
        } else {
            storiesTab = data;            
        }
        displayStories(data, optProjectId);
    });
}

function getStoryW2Date(optProjectId) {
    console.log("getStoryWDate");
    // récupération des parametres
    projectId = $('#sctProjects').val();

    
    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
    console.log('tempUrl', url);
    url += '/stories?filter=';
    url += ' includedone:true';

    url += ' accepted_after:' + date;
    url += ' accepted_before:' + dateEnd;

    console.log('url', url)

    // do API request to get story names
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
        //on affiche les stories et on récupère les taches
    }).done(function (data) {
        if (optProjectId != null && optProjectId !== 'undefined') {
            console.log('dataTransfert', data);
            var projectName = allProjects.find(x => x.id == optProjectId).name
            multipleProjects.push({ 'name': projectName, 'stories': data });
            console.log('multpileprojects', multipleProjects);
        } 
        displayStories(data, optProjectId);
    });//, getTasks(optProjectId));
}

function getTasks(stories, optProjectId) {
    console.log("getTasks", arguments);
    $(stories).each(function (index, story) {
        //création de l'url qui va récupérer les tache de la story
        var url = 'https://www.pivotaltracker.com/services/v5';
        url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
        url += '/stories/' + story.id;
        url += '/tasks';
        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-TrackerToken', token);
            }
        }).done(function (data) {
            if (optProjectId != null && optProjectId !== 'undefined') {
                var projectName = allProjects.find(x => x.id == optProjectId).name
                var index = multipleProjects.findIndex(x => x.name == projectName);
                var storyIndex = multipleProjects[index].stories.findIndex(x => x.id == story.id);
                multipleProjects[index].stories[storyIndex].tasks = data;   
                console.log('multpileprojects', multipleProjects);
            } 
            displayTasks(data); 
            console.log('lestaches',tasksTab);
        });
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
    $('#resultDiv').html('');
    cleanGlobal();
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

function cleanGlobal() {
    storiesTab = [];
    tasksTab = [];
    multipleProjects = [];
}

function runMultiple() {
    $('#resultDiv').html('');
    cleanGlobal();
    var theProjects = $('#sctProjectsMultiple').find('input:checkbox:checked').map(function () {
        console.log('this', this);
        return { 'id':this.id, 'name':this.name };
    });
    console.log('desinfos', dateEnd);
    if (dateEnd != null && dateEnd !== 'undefined') {
        $(theProjects).each(function () {
            getStoryW2Date(this.id);
        });
    } else {
        $(theProjects).each(function () {
            getStoryWDate(this.id);
        })
    }
}