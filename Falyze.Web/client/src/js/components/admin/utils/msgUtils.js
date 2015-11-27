var msgRepo = require('../../../repositories/admin/messageRepo');

module.exports = {
    messages: {
        add: function (key, msg, type, time) {
            var msgs = msgRepo.getModel();
            msgs.push({
                key: key,
                text: msg,
                type: !!type && type.constructor === String ? type : 'note'
            });
            msgRepo.model.set(msgs);
            if (!!time && time.constructor === Number) {
                setTimeout(function () {
                    this.remove(key);
                }.bind(this), time);
            }
        },
        remove: function (key) {
            var msgs = msgRepo.getModel();
            msgs = msgs.filter((m) => m.key !== key);
            msgRepo.model.set(msgs);
        }
    }
}