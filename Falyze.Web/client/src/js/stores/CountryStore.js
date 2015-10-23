var Lean = require('../lean/lean');

module.exports = Lean.createServerStore({
    alias: 'country',
    settings: {
        controller: 'api/Country/',
        key: 'id'
    },
    initialize: function (store, ajax) {
        ajax.get('');
    }
});