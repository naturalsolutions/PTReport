//Date format ISO necessaire a PT : new Date().toISOString().split('.')[0]+"Z"
//Get started Tasks : https://www.pivotaltracker.com/services/v5/projects/536841/stories?with_state=started&updated_after=2017-10-01T08:15:53Z

var token;
var projectId;
var date;
var dateEnd;
var allProjects;
var multipleProjects = [];
var tasksToSetReported = [];

function createCheckboxEntry(name, id) {
    var htmlCheck = '<label class="CheckLabel"><input type="checkbox" class="CheckBoxLabel" name="'+name+'" id="'+id+'" />' + name + '</label>';    
    return htmlCheck;
}

function getAllProjects() {
    //console.log("getAllProjects" + token);
    token = 'b4a752782f711a7c564221c2b0c2d5dc';
    var url = "https://www.pivotaltracker.com/services/v5/projects"
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
    }).done(function (projects) {
        allProjects = projects;
        //console.log('allprojects', allProjects);
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
    //console.log("getStoryWDate");
    // récupération des parametres
    projectId = $('#sctProjects').val();


    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
    url += '/stories?filter=';
    url += ' includedone:true';
    url += ' accepted_after:' + date;
    if(dateEnd && dateEnd != '')
    url += ' accepted_before:' + dateEnd;
    //console.log("l'url", url);
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
        //console.log('data', data);        

        if (optProjectId != null && optProjectId !== 'undefined') {
            //console.log('dataTransfert', data);
            var projectName = allProjects.find(x => x.id == optProjectId).name
            if ($("#checkNotreneco").is(':checked')) {
                data = filterNotReneco(data);
            }
            multipleProjects.push({ 'name': projectName, 'stories': data });
            //console.log('multpileprojects', multipleProjects);
        } else {
            if ($("#checkNotreneco").is(':checked')) {
                data = filterNotReneco(data);
            }
            storiesTab = data;            
        }
        displayStories(data, optProjectId);
        getStartedStories(optProjectId);
    });
}

function getStoryW2Date(optProjectId) {
    //console.log("getStoryWDate");
    // récupération des parametres
    projectId = $('#sctProjects').val();

    
    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
    //console.log('tempUrl', url);
    url += '/stories?filter=';
    url += ' includedone:true';

    url += ' accepted_after:' + date;
    url += ' accepted_before:' + dateEnd;

    //console.log('url', url)

    // do API request to get story names
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
        //on affiche les stories et on récupère les taches
    }).done(function (data) {
        if (optProjectId != null && optProjectId !== 'undefined') {
            //console.log('dataTransfert', data);
            var projectName = allProjects.find(x => x.id == optProjectId).name
            if ($("#checkNotreneco").is(':checked')) {
                data = filterNotReneco(data);
            }
            multipleProjects.push({ 'name': projectName, 'stories': data });
            console.log('multpileprojects', multipleProjects);
        } 
        displayStories(data, (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId));
        getStartedStories((optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId));
    });//, getTasks(optProjectId));
}

function filterNotReneco(stories) {
    var tempResulst = [];
    $(stories).each(function (index, story) {
        if (story.labels.filter(o => o.name.toLowerCase() == 'notreneco').length > 0) {
            console.log('la story : ' + story.id + 'contient le label notreneco et ne sera pas prise en compte');
        } else {
            tempResulst.push(story);
        }
    });
    return tempResulst;

}

function getTasks(stories, optProjectId) {
    //console.log("getTasks", arguments);
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
            var nonStartedTasks = testTasksAlreadyReported(data);
            if (optProjectId != null && optProjectId !== 'undefined') {
                var projectName = allProjects.find(x => x.id == optProjectId).name
                var index = multipleProjects.findIndex(x => x.name == projectName);
                var storyIndex = multipleProjects[index].stories.findIndex(x => x.id == story.id);                
                multipleProjects[index].stories[storyIndex].tasks = nonStartedTasks;   
                //console.log('multpileprojects', multipleProjects);
            } 
            displayTasks(nonStartedTasks); 
            //console.log('lestaches',tasksTab);
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
        //console.log('this', this);
        return { 'id':this.id, 'name':this.name };
    });
    //console.log('desinfos', dateEnd);
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

function getStartedStories(optProjectId) {
    projectId = $('#sctProjects').val();


    // on cré l'url de requete
    var url = 'https://www.pivotaltracker.com/services/v5';
    url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
    //console.log('tempUrl', url);
    url += '/stories?';
    url += 'with_state=started';

    // do API request to get story names
    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-TrackerToken', token);
        }
        //on affiche les stories et on récupère les taches
    }).done(function (data) {
        //console.log('data', data);
        getFinishedTaskInUnfinishedStory(data, optProjectId);
    });//, getTasks(optProjectId));

}

function getFinishedTaskInUnfinishedStory(stories, optProjectId) {
    var storiesWithTasks = [];
    $(stories).each(function () {
        var theStory = this;
        var url = 'https://www.pivotaltracker.com/services/v5';
        url += '/projects/' + (optProjectId != null && optProjectId !== 'undefined' ? optProjectId : projectId);
        url += '/stories/' + this.id;
        url += '/tasks';
        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-TrackerToken', token);
            }
        }).done(function (data) {
            var tempTasksTab = [];
            for (var i in data) {
                //console.log('data[i]', data[i]);
                if (data[i].complete) {
                    //TODO : test du #
                    data[i].project_id = optProjectId;
                    tempTasksTab.push(data[i]);
                }
            }
            if (tempTasksTab.length > 0) {
                tempTasksTab = testFinishedTaskInUnfinishedStoryInDateRange(tempTasksTab)
                displayOneStory(theStory, optProjectId);
                //console.log('thestoyr', theStory);
                storiesWithTasks.push(theStory);
                var nonReportedTasks = testTasksAlreadyReported(tempTasksTab);
                displayTasks(nonReportedTasks);
                tasksToSetReported = tasksToSetReported.concat(nonReportedTasks);
                //console.log('tasksToSetReported', tasksToSetReported);               
                //setTasksReported(nonReportedTasks);
            }
            if ($('input:radio:checked').val() == 'single') {
                if (nonReportedTasks && nonReportedTasks.length > 0) {
                    storiesTab.push(theStory);
                    tasksTab.push(nonReportedTasks);
                }
            } else {
                if (nonReportedTasks && nonReportedTasks.length > 0) {
                    var projectName = allProjects.find(x => x.id == theStory.project_id).name
                    var index = multipleProjects.findIndex(x => x.name == projectName);
                    theStory.tasks = nonReportedTasks;
                    multipleProjects[index].stories.push(theStory);
                   
                }
            }
            //console.log('tasksTab', nonReportedTasks);
        });
    });
}

function testFinishedTaskInUnfinishedStoryInDateRange(tasks) {
    var tasksInDate = [];
    for (var i in tasks) {
        if (new Date(date) < new Date(tasks[i].updated_at) && new Date(tasks[i].updated_at) < new Date(dateEnd)) {
            tasksInDate.push(tasks[i]);
        }
    }
    return tasksInDate;
}

function testTasksAlreadyReported(tasks) {
    var nonReportedTasks = [];
    if (!$('input[name=checkReported]').prop('checked')) {
        for (var i in tasks) {
            if (!tasks[i].description.startsWith('##')) {
                nonReportedTasks.push(tasks[i]);
            }
        }
    } else {
        nonReportedTasks = tasks;
    }
    return nonReportedTasks;
}

function setTasksReported() {
    $(tasksToSetReported).each(function () {
        if (!this.description.startsWith('##')) {

            var dataToSend = '{"description": "##' + this.description + '"}';
            var url = 'https://www.pivotaltracker.com/services/v5';
            url += '/projects/' + this.project_id;
            url += '/stories/' + this.story_id;
            url += '/tasks/' + this.id;
            $.ajax({
                url: url,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-TrackerToken', token);
                },
                type: 'PUT',
                data: dataToSend,
                contentType: 'application/json'
                //on affiche les stories et on récupère les taches
            }).done(function (data) {

            });//, get
        }
    });    
}