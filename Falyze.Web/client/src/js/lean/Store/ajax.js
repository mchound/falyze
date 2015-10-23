var doRequest = function (type, url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                onSuccess(JSON.parse(xhr.responseText));
            }
            else {
                onError(xhr);
            }
        }
    };
    xhr.open(type, url, true);
    xhr.timeout = 100000;
    xhr.ontimeout = onError;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

var Ajax = {
    get: function (url, onSuccess, onError, data) {
        doRequest('GET', url, data, onSuccess, onError);
    },
    post: function (url, data, onSucces, onError) {
        doRequest('POST', url, data, onSucces, onError, false);
    },
    put: function (url, data, onSucces, onError) {
        doRequest('PUT', url, data, onSucces, onError, false);
    },
    remove: function (url, onSucces, onError, data) {
        doRequest('DELETE', url, data, onSucces, onError, false);
    }
};

module.exports = Ajax;