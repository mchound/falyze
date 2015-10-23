var Lean = require('../lean/lean');

module.exports = Lean.createServerStore({
    alias: 'league',
    settings: {
        controller: 'api/League/',
        key: 'id'
    },
    initialize: function (store, ajax) {
        ajax.get('');
    }
});