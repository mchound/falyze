var Ajax = require('../../utils/ajax');

function get(url) {
    var

    _get = function (url) {
        var

        _self = this,

        _url = url,

        _repo,

        _multiple = true,

        _messageRepo,

        _doRequest = function () {
            Ajax.get(
                url, 
                function (response) {

                },
                function (xhr) {
                    if (!_messageRepo) {
                        return;
                    }

                }
            );
        };

        this.one = function () {
            _multiple = false;
            return _self;
        }

        this.from = function (repo) {
            _repo = repo;
            return _self;
        }

        this.tell = function (messageRepo) {
            _messageRepo = messageRepo;
            _doRequest();
        }

        this.now = function () {
            _doRequest();
        }

    }
}


function serverManager(messageRepo) {

    var _serverManager = function (messageRepo) {
        this.get = get;
    }

    return new _serverManager(messageRepo);
}


serverManager.get().from(countryRepo).tell(messageRepo);


module.exports;