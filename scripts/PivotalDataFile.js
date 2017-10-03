var storiesTab = new Array;
var tasksTab = new Array;

function sendNFormatData(stories, tasks) {
    $.ajax({
        url: './WebService/wsFileMaker.asmx/createFile',
        type: 'POST',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{tasks : " + JSON.stringify(tasksTab) + ", stories : " + JSON.stringify(storiesTab) + "}"
    }).success(function (data) {
        console.log('sendNFormatData(stories, tasks)');
        console.log(data.d);
        window.open('CreatedDocs/' + data.d, '_blank');
        setTasksReported();
        //console.log(window.location.href);
        //$('body').append('<a id="fileToDl" href="' + window.location.origin + '/CreatedDocs/' + data.d + '">zgueg</a>');
        //$("#fileToDl").trigger("click");
    }).fail(function (data) {
        alert(data.d);
    });;
}

function sendNFormatDataMultiple(projects) {
    $.ajax({
        url: './WebService/wsFileMaker.asmx/createFileFromTab',
        type: 'POST',
        datatype: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{projects : " + JSON.stringify(projects) + "}"
    }).success(function (data) {
        console.log('sendNFormatData(stories, tasks)');
        console.log(data.d);
        window.open('CreatedDocs/' + data.d, '_blank');
        setTasksReported();
        //console.log(window.location.href);
        //$('body').append('<a id="fileToDl" href="' + window.location.origin + '/CreatedDocs/' + data.d + '">zgueg</a>');
        //$("#fileToDl").trigger("click");
    }).fail(function (data) {
        alert(data.d);
    });;
}

function downloadURL(url) {
    url = 'CreatedDocs/' + url
    console.log(url);
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
};

jQuery.download = function (url, data, method) {
    //url and data options required
    if (url && data) {
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        //send request
        jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
        .appendTo('body').submit().remove();
    };
};